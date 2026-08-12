import { body } from "express-validator";
import { validate } from "../../config/validate.js";


export const createjobValidation = [
    body("title").notEmpty().withMessage("title is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("experience").notEmpty().withMessage("experience is required"),
    body("company").notEmpty().withMessage("company is required"),
    body("city").notEmpty().withMessage("city is required"),
    body("state").notEmpty().withMessage("state is required"),
    body("country").notEmpty().withMessage("country is required"),
    body("pincode").notEmpty().withMessage("pincode is required"),
    body("salary").notEmpty().withMessage("salary is required"),
    body("jobType").notEmpty().withMessage("jobType is required"),
    body("workmode").notEmpty().withMessage("workmode is required"),
    body("category").notEmpty().withMessage("category is required"),
    body("skillsRequired").notEmpty().withMessage("skillsRequired is required"),
    body("responsibilities").notEmpty().withMessage("responsibilities is required"),
    body("qualifications").notEmpty().withMessage("qualifications is required"),
    body("benefits").notEmpty().withMessage("benefits is required"),
    body("status").notEmpty().withMessage("status is required"),
    validate
]

export const updateJobPostingValidation = [
    body("title").notEmpty().withMessage("title is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("experience").notEmpty().withMessage("experience is required"),
    body("company").notEmpty().withMessage("company is required"),
    body("city").notEmpty().withMessage("city is required"),
    body("state").notEmpty().withMessage("state is required"),
    body("country").notEmpty().withMessage("country is required"),
    body("pincode").notEmpty().withMessage("pincode is required"),
    body("salary").notEmpty().withMessage("salary is required"),
    body("jobType").notEmpty().withMessage("jobType is required"),
    body("workmode").notEmpty().withMessage("workmode is required"),
    body("category").notEmpty().withMessage("category is required"),
    body("skillsRequired").notEmpty().withMessage("skillsRequired is required"),
    body("responsibilities").notEmpty().withMessage("responsibilities is required"),
    body("qualifications").notEmpty().withMessage("qualifications is required"),
    body("benefits").notEmpty().withMessage("benefits is required"),
    body("status").notEmpty().withMessage("status is required"),
    validate
]
