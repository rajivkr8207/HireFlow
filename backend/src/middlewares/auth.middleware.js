import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Config from '../config/Config.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw new ApiError(401, 'Unauthorized request');
  }
  try {
    const decodedToken = jwt.verify(token, Config.jwt_access_secret);
    req.user = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid token', error);
  }
});

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }
});

export const verifyCandidate = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'candidate') {
    next();
  } else {
    throw new ApiError(403, 'Forbidden: Candidate access required');
  }
});

export const verifyRecruiter = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'recruiter') {
    next();
  } else {
    throw new ApiError(403, 'Forbidden: Recruiter access required');
  }
});
