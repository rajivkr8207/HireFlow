import jobpostingModel from "./jobposting.model.js";



export const CreateJobposting = async (payload) => {
    const { title, description, experience, company, city, state, country, pincode, salary, jobType, workmode, category, skillsRequired, responsibilities, qualifications, benefits, status } = payload
    const job = await jobpostingModel.create({
        title,
        description,
        experience,
        company,
        city,
        state,
        country,
        pincode,
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
    return job
}

export const updateJobposting = async (id, payload) => {
    const { title, description, experience, company, city, state, country, pincode, salary, jobType, workmode, category, skillsRequired, responsibilities, qualifications, benefits, status } = payload
    const job = await jobpostingModel.findByIdAndUpdate(id, { title, description, experience, company, city, state, country, pincode, salary, jobType, workmode, category, skillsRequired, responsibilities, qualifications, benefits, status }, { new: true })
    return job
}

export const getJobposting = async (id) => {
    const job = await jobpostingModel.findById(id)
    return job
}

export const getAllJob = async (recuiterid) => {
    const job = await jobpostingModel.find({ userId: recuiterid });
    return job
}

export const deleteJobposting = async (id) => {
    const job = await jobpostingModel.findByIdAndDelete(id)
    return job
}

export const ClosejobPosting = async (id) => {
    const job = await jobpostingModel.findByIdAndUpdate(id, { status: "closed" })
    return job
}

export const OpenjobPosting = async (id) => {
    const job = await jobpostingModel.findByIdAndUpdate(id, { status: "open" })
    return job
}

export const HoldjobPosting = async (id) => {
    const job = await jobpostingModel.findByIdAndUpdate(id, { status: "hold" })
    return job
}