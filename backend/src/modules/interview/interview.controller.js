import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { Interview } from './interview.model.js';
import {
  scheduleInterview,
  getMyInterviews,
  getInterviewByApplicationId,
} from './interview.service.js';
import { createLiveKitToken } from '../../service/livekit.service.js';
import Config from '../../config/Config.js';

export const ScheduleInterview = asyncHandler(async (req, res) => {
  const { applicationId, scheduledAt, title } = req.body;

  if (!applicationId || !scheduledAt) {
    throw new ApiError(400, 'applicationId and scheduledAt are required');
  }

  const recruiterId = req.user.id;

  const interview = await scheduleInterview({
    applicationId,
    recruiterId,
    scheduledAt,
    title,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, interview, 'Interview scheduled successfully'));
});

export const joinInterview = asyncHandler(async (req, res) => {
  const interviewId = req.params.interview_id || req.params.interviewId;

  if (!interviewId) {
    throw new ApiError(400, 'Interview id is required');
  }

  const userId = req.user.id;

  const interview = await Interview.findById(interviewId)
    .populate({
      path: 'applicationId',
      populate: { path: 'jobId', select: 'title company location description' },
    })
    .populate('recruiterId', 'fullName email image')
    .populate('candidateId', 'fullName email image');

  if (!interview) {
    throw new ApiError(404, 'Interview not found');
  }

  const isRecruiter = interview.recruiterId._id.toString() === userId.toString();
  const isCandidate = interview.candidateId._id.toString() === userId.toString();

  if (!isRecruiter && !isCandidate) {
    throw new ApiError(403, 'You are not allowed to join this interview');
  }

  const roomName = interview.roomName || interview.dailyRoomName;
  const userName = isRecruiter
    ? interview.recruiterId.fullName
    : interview.candidateId.fullName;

  const token = await createLiveKitToken({
    roomName,
    userName,
    userId,
    isRecruiter,
  });

  // If status is SCHEDULED, update to ONGOING upon first join
  if (interview.status === 'SCHEDULED') {
    interview.status = 'ONGOING';
    await interview.save();
  }

  const serverUrl = Config.livekit_url || interview.livekitUrl;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        serverUrl,
        roomUrl: serverUrl,
        token,
        interview,
        userRole: isRecruiter ? 'recruiter' : 'candidate',
      },
      'Meeting details generated successfully',
    ),
  );
});

export const CancelInterview = asyncHandler(async (req, res) => {
  const interviewId = req.body.interview_id || req.body.interviewId;

  if (!interviewId) {
    throw new ApiError(400, 'Interview id is required');
  }

  const interview = await Interview.findByIdAndUpdate(
    interviewId,
    { status: 'CANCELLED' },
    { new: true },
  );

  if (!interview) {
    throw new ApiError(404, 'Interview not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, interview, 'Interview cancelled successfully'));
});

export const GetInterview = asyncHandler(async (req, res) => {
  const interviewId = req.params.interview_id || req.params.interviewId;

  if (!interviewId) {
    throw new ApiError(400, 'Interview id is required');
  }

  const interview = await Interview.findById(interviewId)
    .populate({
      path: 'applicationId',
      populate: { path: 'jobId', select: 'title company location description' },
    })
    .populate('recruiterId', 'fullName email image')
    .populate('candidateId', 'fullName email image');

  if (!interview) {
    throw new ApiError(404, 'Interview not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, interview, 'Interview fetched successfully'));
});

export const GetMyInterviewsController = asyncHandler(async (req, res) => {
  const interviews = await getMyInterviews(req.user.id);
  return res
    .status(200)
    .json(new ApiResponse(200, interviews, 'My interviews fetched successfully'));
});

export const GetInterviewByApplicationController = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  if (!applicationId) {
    throw new ApiError(400, 'Application ID is required');
  }

  const interview = await getInterviewByApplicationId(applicationId, req.user.id);
  return res
    .status(200)
    .json(new ApiResponse(200, interview, 'Interview fetched successfully'));
});
