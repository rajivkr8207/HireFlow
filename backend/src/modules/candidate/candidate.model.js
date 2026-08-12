import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        headline: {
            type: String,
        },
        bio: {
            type: String,
        },
        education: {
            type: String,
        },
        location: {
            city: String,
            state: String,
            country: String,
            pincode: String,
        },
        certifications: [{
            type: String,
        }],
        skills: {
            type: [String],
            default: [],
        },
        experience: {
            type: Number,
        },
        resume: {
            type: String,
        },
        portfolio: {
            type: String,
        },
        github: {
            type: String,
        },
        linkedin: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);
