import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { CreateRecruiter, getRecuiter, updateRecruiter } from './recruiter.service.js';

export const RegisterRecruiter = asyncHandler(async (req, res) => {
  const { userId, company, designation, bio, linkedin } = req.body;
  const RecruiterCreate = await CreateRecruiter({ userId, company, designation, bio, linkedin });
  return res
    .status(200)
    .json(new ApiResponse(200, RecruiterCreate, 'Recruiter created successfully'));
});

export const GetRecruiter = asyncHandler(async (req, res) => {
  const recruiter = await getRecuiter(req.user?.id);
  return res.status(200).json(new ApiResponse(200, recruiter, 'Recruiter fetched successfully'));
});

export const UpdateRecruiter = asyncHandler(async (req, res) => {
  const recruiter = await updateRecruiter(req.params?.id, req.body);
  return res.status(200).json(new ApiResponse(200, recruiter, 'Recruiter updated successfully'));
});
