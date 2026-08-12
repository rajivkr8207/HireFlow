import { body } from "express-validator";
import { validate } from "../../config/validate.js";


export const RecruiterValidation = [
    body("userId")
        .trim()
        .notEmpty().withMessage("User ID is required")
        .isLength({ min: 24, max: 24 }).withMessage("User ID must be 24 characters long"),
    body("company")
        .trim()
        .notEmpty().withMessage("Company is required")
        .isLength({ min: 2, max: 60 }).withMessage("Company must be between 2 and 60 characters"),
    body("designation")
        .trim()
        .notEmpty().withMessage("Designation is required")
        .isLength({ min: 2, max: 60 }).withMessage("Designation must be between 2 and 60 characters"),
    body("bio")
        .trim()
        .notEmpty().withMessage("Bio is required")
        .isLength({ min: 2, max: 60 }).withMessage("Bio must be between 2 and 60 characters"),
    body("linkedin")
        .trim()
        .notEmpty().withMessage("LinkedIn is required")
        .isLength({ min: 2, max: 60 }).withMessage("LinkedIn must be between 2 and 60 characters"),
    validate
];


export const RecruiterUpdateValidation = [
    body("company")
        .optional()
        .trim()
        .isLength({ min: 2, max: 60 }).withMessage("Company must be between 2 and 60 characters"),
    body("designation")
        .optional()
        .trim()
        .isLength({ min: 2, max: 60 }).withMessage("Designation must be between 2 and 60 characters"),
    body("bio")
        .optional()
        .trim()
        .isLength({ min: 2, max: 250 }).withMessage("Bio must be between 2 and 250 characters"),
    body("linkedin")
        .optional()
        .trim()
        .isURL().withMessage("LinkedIn must be a valid URL"),
    validate
]