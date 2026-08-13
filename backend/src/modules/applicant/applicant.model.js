import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobPosting",
            required: true,
            index: true,
        },

        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
            required: true,
            index: true,
        },

        resume: {
            type: String,
            required: true,
        },

        coverLetter: {
            type: String,
            trim: true,
        },

        expectedSalary: {
            type: Number,
        },

        noticePeriod: {
            type: Number, // days
        },

        status: {
            type: String,
            enum: [
                "applied",
                "shortlisted",
                "screening",
                "interview",
                "selected",
                "rejected",
                "withdrawn",
            ],
            default: "applied",
            index: true,
        },

        atsScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        atsFeedback: {
            matchedSkills: [String],
            missingSkills: [String],
            summary: String,
        },
    },
    {
        timestamps: true,
    }
);
applicationSchema.index(
    { jobId: 1, candidateId: 1 },
    { unique: true }
);

export const Application = mongoose.model("Application", applicationSchema);