import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED',
    },

    roomName: {
      type: String,
      default: null,
    },

    livekitUrl: {
      type: String,
      default: null,
    },

    dailyRoomName: {
      type: String,
      default: null,
    },

    dailyRoomUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Interview = mongoose.model('Interview', interviewSchema);
