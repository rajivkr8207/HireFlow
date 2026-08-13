import jobpostingModel from "./jobposting.model.js";
import { Application } from "../applicant/applicant.model.js";

export const CreateJobposting = async (payload) => {
    const { userId, title, description, experience, company, city, state, country, pincode, salary, jobType, workmode, category, skillsRequired, responsibilities, qualifications, benefits, status } = payload;
    const job = await jobpostingModel.create({
        userId,
        title,
        description,
        experience,
        company,
        location: { city, state, country, pincode },
        salary,
        jobType,
        workmode,
        category,
        skillsRequired,
        responsibilities,
        qualifications,
        benefits,
        status,
    });
    return job;
};

export const updateJobposting = async (id, payload) => {
    const { title, description, experience, company, city, state, country, pincode, salary, jobType, workmode, category, skillsRequired, responsibilities, qualifications, benefits, status } = payload;
    const job = await jobpostingModel.findByIdAndUpdate(
        id,
        { title, description, experience, company, location: { city, state, country, pincode }, salary, jobType, workmode, category, skillsRequired, responsibilities, qualifications, benefits, status },
        { new: true }
    );
    return job;
};

export const getJobposting = async (id) => {
    const job = await jobpostingModel.findById(id);
    return job;
};

export const getAllJob = async (recuiterid) => {
    const job = await jobpostingModel.find({ userId: recuiterid });
    return job;
};

export const deleteJobposting = async (id) => {
    const job = await jobpostingModel.findByIdAndDelete(id);
    return job;
};

export const ClosejobPosting = async (id) => {
    const job = await jobpostingModel.findByIdAndUpdate(id, { status: "closed" }, { new: true });
    return job;
};

export const OpenjobPosting = async (id) => {
    const job = await jobpostingModel.findByIdAndUpdate(id, { status: "open" }, { new: true });
    return job;
};

export const HoldjobPosting = async (id) => {
    const job = await jobpostingModel.findByIdAndUpdate(id, { status: "hold" }, { new: true });
    return job;
};

/**
 * Get all applicants for a specific job posting with candidate details & ATS score
 */
export const getJobApplicants = async (jobId) => {
    const applications = await Application.find({ jobId })
        .populate({
            path: "candidateId",
            select: "userId headline bio education location skills experience resume portfolio github linkedin",
            populate: {
                path: "userId",
                select: "fullName email phone image",
            },
        })
        .sort({ atsScore: -1, createdAt: -1 });

    return applications;
};

/**
 * Update candidate application status (e.g. shortlisted, interview, selected, rejected)
 */
export const updateApplicationStatus = async (applicationId, status) => {
    const application = await Application.findByIdAndUpdate(
        applicationId,
        { status },
        { new: true }
    );
    return application;
};
