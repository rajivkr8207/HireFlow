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
  console.log("applyjob", {
    userId,
    jobId,
    file,
    resume,
    coverLetter,
    expectedSalary,
    noticePeriod,
  })
  // 1. Verify job exists and is open
  const job = await jobpostingModel.findById(jobId);
  console.log("job", job)
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }
  if (job.status !== 'open') {
    throw new ApiError(400, 'This job is no longer accepting applications');
  }

  // 2. Find or auto-create candidate profile
  const candidate = await getOrCreateCandidate(userId);
  console.log('candidate', candidate)
  // 3. Check for duplicate application
  const existing = await Application.findOne({ jobId, candidateId: candidate._id });
  console.log('existing', existing)
  if (existing) {
    throw new ApiError(409, 'You have already applied to this job');
  }

  // 4. Upload Resume File to ImageKit & Extract Text
  let finalResumeUrl = resume || '';
  let resumeText = '';

  if (file) {
    console.log('Resume file received:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // -----------------------------------
    // 4.1 Upload Resume to ImageKit
    // -----------------------------------

    try {
      const uploadResult = await imagekitService.uploadDocument(
        file,
        userId,
      );

      console.log('ImageKit upload result:', uploadResult);

      finalResumeUrl = uploadResult?.url || '';

    } catch (uploadErr) {
      console.error(
        'ImageKit upload error:',
        uploadErr,
      );

      // Candidate ka existing resume use karo
      if (!finalResumeUrl && candidate.resume) {
        finalResumeUrl = candidate.resume;
      }

      // Existing resume bhi nahi hai
      if (!finalResumeUrl) {
        throw new ApiError(
          500,
          `Failed to upload resume to ImageKit: ${uploadErr.message
          }`,
        );
      }
    }

    // -----------------------------------
    // 4.2 Extract Resume Text
    // -----------------------------------

    try {
      if (!file.buffer) {
        throw new Error('Resume file buffer is empty');
      }

      resumeText = await extractResumeText(
        file.buffer,
        file.mimetype,
      );

      console.log(
        'Resume text extracted:',
        resumeText?.length,
      );

    } catch (extractErr) {
      console.error(
        'Resume text extraction error:',
        extractErr,
      );

      throw new ApiError(
        400,
        `Failed to extract resume text: ${extractErr.message
        }`,
      );
    }
  }

  // -----------------------------------
  // 4.3 If no resume URL
  // -----------------------------------

  console.log('Final resume URL:', finalResumeUrl);
  console.log('Resume text length:', resumeText.length);

  if (!finalResumeUrl) {
    if (candidate.resume) {
      finalResumeUrl = candidate.resume;
    } else {
      throw new ApiError(
        400,
        'Please upload a resume file or provide a valid resume link',
      );
    }
  }

  // -----------------------------------
  // 4.4 Update candidate resume
  // -----------------------------------

  if (finalResumeUrl && !candidate.resume) {
    candidate.resume = finalResumeUrl;
    await candidate.save();
  }

  console.log(
    'Step 4 completed successfully',
  );

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
  console.log("application", application)
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
