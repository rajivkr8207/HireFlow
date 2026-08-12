import mongoose from "mongoose";

const jobposting = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: String,
    description: String,
    experience: String,
    company: String,
    location: {
        city: String,
        state: String,
        country: String,
        pincode: String,
    },
    salary: String,
    jobType: String,
    workmode: {
        type: String,
        enum: ["full-time", "part-time", "contract", "temporary", "other"],
        default: "full-time"
    },
    category: {
        type: String,
        enum: ["IT", "HR", "Finance", "Marketing", "Sales", "Other"],
        default: "IT"
    },
    skillsRequired: [String],
    responsibilities: [String],
    qualifications: [String],
    benefits: [String],
    status: {
        type: String,
        enum: ["open", "closed", "hold"],
        default: "open"
    },
}, { timestamps: true })

export default mongoose.model("JobPosting", jobposting);