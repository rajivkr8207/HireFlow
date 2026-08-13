import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import {
  getAllJobsForCandidate,
  applyToJob,
  getMyApplications,
  withdrawApplication,
} from './applicant.service.js';
import fs from 'fs';
/**
 * GET /api/v1/applicant/jobs
 * Paginated list of all open jobs for candidates to browse
 */
export const getAllJobsController = asyncHandler(async (req, res) => {
  const { page, limit, status, category, workmode } = req.query;
  const result = await getAllJobsForCandidate({ page, limit, status, category, workmode });
  return res.status(200).json(new ApiResponse(200, result, 'Jobs fetched successfully'));
});

/**
 * POST /api/v1/applicant/apply
 * Candidate submits an application for a job (supports file upload & ATS extraction)
 */
export const applyJobController = asyncHandler(async (req, res) => {
  const { jobId, resume, coverLetter, expectedSalary, noticePeriod } = req.body;
  const application = await applyToJob({
    userId: req.user.id,
    jobId,
    file: req.file,
    resume,
    coverLetter,
    expectedSalary,
    noticePeriod,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, application, 'Application submitted successfully'));
});

/**
 * GET /api/v1/applicant/my-applications
 * Get all applications submitted by the logged-in candidate with ATS Score (paginated)
 */
export const getMyApplicationsController = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await getMyApplications({ userId: req.user.id, page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Applications fetched successfully'));
});

/**
 * PATCH /api/v1/applicant/withdraw/:id
 * Candidate withdraws one of their applications
 */
export const withdrawApplicationController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const application = await withdrawApplication({
    userId: req.user.id,
    applicationId: id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, application, 'Application withdrawn successfully'));
});
