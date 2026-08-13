import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  ClosejobPosting,
  CreateJobposting,
  deleteJobposting,
  getAllJob,
  getJobposting,
  OpenjobPosting,
  updateJobposting,
  HoldjobPosting,
  getJobApplicants,
  updateApplicationStatus,
} from './jobposting.service.js';

export const createjobController = asyncHandler(async (req, res) => {
  const job = await CreateJobposting({ ...req.body, userId: req.user.id });
  return res.json(new ApiResponse(200, job, 'Job created successfully'));
});

export const getAllJobPostingController = asyncHandler(async (req, res) => {
  const job = await getAllJob(req?.user?.id);
  return res.json(new ApiResponse(200, job, 'Job fetched successfully'));
});

export const updateJobPostingController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await updateJobposting(id, req.body);
  return res.json(new ApiResponse(200, job, 'Job updated successfully'));
});

export const deleteJobpostingController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await deleteJobposting(id);
  return res.json(new ApiResponse(200, job, 'Job deleted successfully'));
});

export const getJobpostingController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await getJobposting(id);
  return res.json(new ApiResponse(200, job, 'Job fetched successfully'));
});

export const ClosejobPostingController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await ClosejobPosting(id);
  return res.json(new ApiResponse(200, job, 'Job closed successfully'));
});

export const HoldjobPostingController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await HoldjobPosting(id);
  return res.json(new ApiResponse(200, job, 'Job hold successfully'));
});

export const OpenjobPostingController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await OpenjobPosting(id);
  return res.json(new ApiResponse(200, job, 'Job open successfully'));
});

export const getJobApplicantsController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const applicants = await getJobApplicants(id);
  return res.json(new ApiResponse(200, applicants, 'Job applicants fetched successfully'));
});

export const updateApplicationStatusController = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;
  const application = await updateApplicationStatus(applicationId, status);
  return res.json(new ApiResponse(200, application, 'Application status updated successfully'));
});
