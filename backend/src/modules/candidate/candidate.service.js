import { ApiError } from '../../utils/ApiError.js';
import candidateModel from './candidate.model.js';

export const RegisterCandidate = async (payload) => {
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
  } = payload;
  const userIdexists = await candidateModel.findOne({ userId });
  if (userIdexists) {
    throw new ApiError(400, 'User already exists');
  }
  const candidate = new candidateModel({
    userId,
    headline,
    bio,
    education,
    location: {
      city,
      state,
      country,
      pincode,
    },
    certifications,
    skills,
    experience,
    resume,
    portfolio,
    github,
    linkedin,
  });

  return await candidate.save();
};

export const GetCandidate = async (payload) => {
  const { userId } = payload;
  const candidate = await candidateModel.findOne({ userId });
  if (!candidate) {
    throw new ApiError(404, 'Candidate not found');
  }
  return await candidate.save();
};

export const UpdateCandidate = async (payload) => {
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
  } = payload;
  const candidate = await candidateModel.findOne({ userId });
  if (!candidate) {
    throw new ApiError(404, 'Candidate not found');
  }
  candidate.headline = headline;
  candidate.bio = bio;
  candidate.education = education;
  candidate.location = {
    city,
    state,
    country,
    pincode,
  };
  candidate.certifications = certifications;
  candidate.skills = skills;
  candidate.experience = experience;
  candidate.resume = resume;
  candidate.portfolio = portfolio;
  candidate.github = github;
  candidate.linkedin = linkedin;
  return await candidate.save();
};
