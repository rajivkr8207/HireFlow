import { body } from 'express-validator';
import { validate } from '../../config/validate.js';

export const CandidateRegisterValidate = [
  body('userId')
    .trim()
    .notEmpty()
    .withMessage('User ID is required')
    .isLength({ min: 24, max: 24 })
    .withMessage('User ID must be 24 characters long'),
  body('headline')
    .trim()
    .notEmpty()
    .withMessage('Headline is required')
    .isLength({ min: 2, max: 250 })
    .withMessage('Headline must be between 2 and 250 characters'),
  body('bio')
    .trim()
    .notEmpty()
    .withMessage('Bio is required')
    .isLength({ min: 2, max: 250 })
    .withMessage('Bio must be between 2 and 250 characters'),
  body('education')
    .trim()
    .notEmpty()
    .withMessage('Education is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Education must be between 2 and 60 characters'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('City must be between 2 and 60 characters'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('State must be between 2 and 60 characters'),
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Country must be between 2 and 60 characters'),
  body('pincode')
    .trim()
    .notEmpty()
    .withMessage('Pincode is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Pincode must be 6 digits'),
  body('certifications')
    .optional()
    .isArray()
    .withMessage('Certifications must be an array of strings'),
  body('skills').optional().isArray().withMessage('Skills must be an array of strings'),
  body('experience').optional().isNumeric().withMessage('Experience must be a number'),
  body('resume').optional().isString().withMessage('Resume must be a string'),
  body('portfolio').optional().isString().withMessage('Portfolio must be a string'),
  body('github').optional().isString().withMessage('Github must be a string'),
  body('linkedin').optional().isString().withMessage('LinkedIn must be a string'),
  validate,
];

export const CandidateUpdateValidate = [
  body('headline')
    .optional()
    .trim()
    .isLength({ min: 2, max: 250 })
    .withMessage('Headline must be between 2 and 250 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ min: 2, max: 250 })
    .withMessage('Bio must be between 2 and 250 characters'),
  body('education')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Education must be between 2 and 60 characters'),
  body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('City must be between 2 and 60 characters'),
  body('state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('State must be between 2 and 60 characters'),
  body('country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Country must be between 2 and 60 characters'),
  body('pincode')
    .optional()
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('Pincode must be 6 digits'),
  body('certifications')
    .optional()
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error('Certifications must be an array');
      }
      for (const cert of value) {
        if (typeof cert !== 'string' || cert.trim().length === 0) {
          throw new Error('Each certification must be a non-empty string');
        }
      }
      return true;
    }),
  body('skills')
    .optional()
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error('Skills must be an array');
      }
      for (const skill of value) {
        if (typeof skill !== 'string' || skill.trim().length === 0) {
          throw new Error('Each skill must be a non-empty string');
        }
      }
      return true;
    }),
  body('experience').optional().isNumeric().withMessage('Experience must be a number'),
  body('resume').optional().isString().withMessage('Resume must be a string'),
  body('portfolio').optional().isString().withMessage('Portfolio must be a string'),
  body('github').optional().isString().withMessage('Github must be a string'),
  body('linkedin').optional().isString().withMessage('LinkedIn must be a string'),
  validate,
];
