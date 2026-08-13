import User from '../user/user.model.js';
import recruiterModel from './recruiter.model.js';

export const CreateRecruiter = async ({ userId, company, designation, bio, linkedin }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  if (user.role !== 'recruiter') {
    throw new ApiError(403, 'User is not a recruiter');
  }
  const recruiter = await recruiterModel.create({
    userId,
    company,
    designation,
    bio,
    linkedin,
  });
  return recruiter;
};

export const getRecuiter = async (id) => {
  const recruiter = await recruiterModel.findById(id);
  if (!recruiter) {
    throw new ApiError(404, 'Recruiter not found');
  }
  return recruiter;
};

export const updateRecruiter = async (id, { company, designation, bio, linkedin }) => {
  const recruiter = await recruiterModel.findByIdAndUpdate(
    id,
    {
      company,
      designation,
      bio,
      linkedin,
    },
    { new: true },
  );
  if (!recruiter) {
    throw new ApiError(404, 'Recruiter not found');
  }
  return recruiter;
};
