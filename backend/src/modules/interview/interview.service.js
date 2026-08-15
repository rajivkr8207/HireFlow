import crypto from 'crypto';
import { Interview } from './interview.model.js';
import { Application } from '../applicant/applicant.model.js';
import Config from '../../config/Config.js';
import { ApiError } from '../../utils/ApiError.js';

export const scheduleInterview = async ({ applicationId, recruiterId, scheduledAt }) => {
  // 1. Find Application
  const application = await Application.findById(applicationId)
    .populate('candidateId')
    .populate('jobId');

  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  // 2. Check if the current user is the recruiter who posted this job
  const jobRecruiterId = application.jobId?.userId?.toString();
  if (jobRecruiterId !== recruiterId.toString()) {
    throw new ApiError(403, 'You are not authorized to schedule an interview for this job');
  }

  // 3. Check for existing active interview
  const existingInterview = await Interview.findOne({
    applicationId,
    status: { $in: ['SCHEDULED', 'ONGOING'] },
  });

  if (existingInterview) {
    throw new ApiError(400, 'An active interview is already scheduled for this application');
  }

  // 4. Generate LiveKit room name & start time
  const roomName = `interview-${crypto.randomUUID()}`;
  const startTime = new Date(scheduledAt);
  const livekitUrl = Config.livekit_url;

  // 5. Candidate User ID
  const candidateUserId = application.candidateId?.userId || application.candidateId;

  // 6. Create Interview in MongoDB
  const interview = await Interview.create({
    applicationId,
    recruiterId,
    candidateId: candidateUserId,
    scheduledAt: startTime,
    status: 'SCHEDULED',
    roomName,
    livekitUrl,
    dailyRoomName: roomName,
    dailyRoomUrl: livekitUrl,
  });

  // 8. Update Application Status to 'interview'
  application.status = 'interview';
  await application.save();

  return interview;
};

export const getMyInterviews = async (userId) => {
  const interviews = await Interview.find({
    $or: [{ recruiterId: userId }, { candidateId: userId }],
  })
    .populate({
      path: 'applicationId',
      populate: { path: 'jobId', select: 'title company location' },
    })
    .populate('recruiterId', 'fullName email image')
    .populate('candidateId', 'fullName email image')
    .sort({ scheduledAt: 1 });

  return interviews;
};

export const getInterviewByApplicationId = async (applicationId, userId) => {
  const interview = await Interview.findOne({ applicationId })
    .populate({
      path: 'applicationId',
      populate: { path: 'jobId', select: 'title company location description' },
    })
    .populate('recruiterId', 'fullName email image')
    .populate('candidateId', 'fullName email image');

  if (!interview) {
    return null;
  }

  // Check authorization
  const isRecruiter = interview.recruiterId._id.toString() === userId.toString();
  const isCandidate = interview.candidateId._id.toString() === userId.toString();

  if (!isRecruiter && !isCandidate) {
    throw new ApiError(403, 'You are not authorized to view this interview');
  }

  return interview;
};
