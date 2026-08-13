import { ApiError } from '../../utils/ApiError.js';
import { Application } from './applicant.model.js';
import jobpostingModel from '../jobposting/jobposting.model.js';
import candidateModel from '../candidate/candidate.model.js';
import imagekitService from '../../service/imagekit.service.js';
import { extractResumeText, calculateATSScore } from '../../utils/atsScorer.js';

/**
 * Get all open jobs with pagination and optional filters (for candidates browsing)
 */
export const getAllJobsForCandidate = async ({
  page = 1,
  limit = 10,
  status,
  category,
  workmode,
}) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (status) filter.status = status;
  else filter.status = 'open';
  if (category) filter.category = category;
  if (workmode) filter.workmode = workmode;

  const [jobs, total] = await Promise.all([
    jobpostingModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).select('-__v'),
    jobpostingModel.countDocuments(filter),
  ]);

  return {
    jobs,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    },
  };
};

/**
 * Helper to ensure a candidate record exists for a user
 */
const getOrCreateCandidate = async (userId, defaultResume = '') => {
  let candidate = await candidateModel.findOne({ userId });
  if (!candidate) {
    candidate = await candidateModel.create({
      userId,
      resume: defaultResume,
    });
  }
  return candidate;
};

/**
 * Apply to a job � Uploads resume to ImageKit, extracts text, calculates ATS score, saves application.
 */
export const applyToJob = async ({
  userId,
  jobId,
  file,
  resume,
  coverLetter,
  expectedSalary,
  noticePeriod,
}) => {
  // 1. Verify job exists and is open
  const job = await jobpostingModel.findById(jobId);
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }
  if (job.status !== 'open') {
    throw new ApiError(400, 'This job is no longer accepting applications');
  }

  // 2. Find or auto-create candidate profile
  const candidate = await getOrCreateCandidate(userId);

  // 3. Check for duplicate application
  const existing = await Application.findOne({ jobId, candidateId: candidate._id });
  if (existing) {
    throw new ApiError(409, 'You have already applied to this job');
  }

  // 4. Upload Resume File to ImageKit & Extract Text
  let finalResumeUrl = resume || '';
  let resumeText = '';

  if (file) {
    try {
      const uploadResult = await imagekitService.uploadDocument(file, userId);
      console.log('imagekit result', uploadResult);
      finalResumeUrl = uploadResult.url;
    } catch (uploadErr) {
      if (!finalResumeUrl && candidate.resume) {
        finalResumeUrl = candidate.resume;
      }
      if (!finalResumeUrl) {
        throw new ApiError(500, `Failed to upload resume to ImageKit: ${uploadErr.message}`);
      }
    }
    resumeText = await extractResumeText(file.buffer, file.mimetype);
  }

  if (!finalResumeUrl) {
    if (candidate.resume) {
      finalResumeUrl = candidate.resume;
    } else {
      throw new ApiError(400, 'Please upload a resume file or provide a valid resume link');
    }
  }

  // Update candidate profile resume if not present
  if (finalResumeUrl && !candidate.resume) {
    candidate.resume = finalResumeUrl;
    await candidate.save();
  }

  // 5. Calculate ATS Score
  const {
    score: atsScore,
    matchedSkills,
    missingSkills,
    summary,
  } = await calculateATSScore({
    resumeText,
    candidateSkills: candidate.skills || [],
    coverLetter: coverLetter || '',
    job,
  });

  // 6. Create application
  const application = await Application.create({
    jobId,
    candidateId: candidate._id,
    resume: finalResumeUrl,
    coverLetter,
    expectedSalary,
    noticePeriod,
    atsScore,
    atsFeedback: {
      matchedSkills,
      missingSkills,
      summary,
    },
  });

  return application;
};

/**
 * Get all applications submitted by candidate (including ATS score & feedback)
 */
export const getMyApplications = async ({ userId, page = 1, limit = 10 }) => {
  const candidate = await getOrCreateCandidate(userId);

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [applications, total] = await Promise.all([
    Application.find({ candidateId: candidate._id })
      .populate(
        'jobId',
        'title company location salary jobType workmode status category experience skillsRequired',
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v'),
    Application.countDocuments({ candidateId: candidate._id }),
  ]);

  return {
    applications,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    },
  };
};

/**
 * Withdraw an application
 */
export const withdrawApplication = async ({ userId, applicationId }) => {
  const candidate = await getOrCreateCandidate(userId);

  const application = await Application.findOne({ _id: applicationId, candidateId: candidate._id });
  if (!application) {
    throw new ApiError(404, 'Application not found or does not belong to you');
  }

  if (application.status === 'withdrawn') {
    throw new ApiError(400, 'Application already withdrawn');
  }

  application.status = 'withdrawn';
  await application.save();
  return application;
};
