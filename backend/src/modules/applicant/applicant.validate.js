import { body, query } from "express-validator";
import { validate } from "../../config/validate.js";

// Validation for submitting a job application
export const applyJobValidation = [
    body("jobId")
        .notEmpty().withMessage("jobId is required")
        .isMongoId().withMessage("jobId must be a valid MongoDB ObjectId"),

    body("resume")
        .optional()
        .isString().withMessage("resume must be a string"),

    body("coverLetter")
        .optional()
        .isString().withMessage("coverLetter must be a string"),

    body("expectedSalary")
        .optional()
        .isNumeric().withMessage("expectedSalary must be a number"),

    body("noticePeriod")
        .optional()
        .isInt({ min: 0 }).withMessage("noticePeriod must be a non-negative integer (days)"),

    validate,
];

// Validation for paginated get-all-jobs query params (candidate browsing)
export const getAllJobsValidation = [
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("page must be a positive integer"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),

    query("status")
        .optional()
        .isIn(["open", "closed", "hold"]).withMessage("status must be one of: open, closed, hold"),

    query("category")
        .optional()
        .isIn(["IT", "HR", "Finance", "Marketing", "Sales", "Other"])
        .withMessage("Invalid category"),

    query("workmode")
        .optional()
        .isIn(["full-time", "part-time", "contract", "temporary", "other"])
        .withMessage("Invalid workmode"),

    validate,
];
