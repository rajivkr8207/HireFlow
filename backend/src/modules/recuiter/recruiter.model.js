import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  linkedin: {
    type: String,
  },
});

export default mongoose.model('Recruiter', recruiterSchema);
