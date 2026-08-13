import { GetCandidate, RegisterCandidate } from './candidate.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const RegisterCandidateController = asyncHandler(async (req, res) => {
  const {
    userId,
    headline,
    bio,
    education,
    city,
    state,
    country,
    pincode,
    certifications,
    skills,
    experience,
    resume,
    portfolio,
    github,
    linkedin,
  } = req.body;
  const candidate = await RegisterCandidate({
    userId,
    headline,
    bio,
    education,
    city,
    state,
    country,
    pincode,
    certifications,
    skills,
    experience,
    resume,
    portfolio,
    github,
    linkedin,
  });
  return res.status(201).json(new ApiResponse(201, candidate, 'Candidate registered successfully'));
});

export const GetCandidateController = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const candidate = await GetCandidate({ userId });
  return res.status(200).json(new ApiResponse(200, candidate, 'Candidate fetched successfully'));
});

export const UpdateCandidateController = asyncHandler(async (req, res) => {
  const {
    userId,
    headline,
    bio,
    education,
    city,
    state,
    country,
    pincode,
    certifications,
    skills,
    experience,
    resume,
    portfolio,
    github,
    linkedin,
  } = req.body;
  const candidate = await UpdateCandidate({
    userId,
    headline,
    bio,
    education,
    city,
    state,
    country,
    pincode,
    certifications,
    skills,
    experience,
    resume,
    portfolio,
    github,
    linkedin,
  });
  return res.status(200).json(new ApiResponse(200, candidate, 'Candidate updated successfully'));
});
