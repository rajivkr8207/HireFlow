import { body } from 'express-validator';
import { validate } from '../../config/validate.js';

export const ScheduleInterviewValidate = [
  body('applicationId').notEmpty().withMessage('applicationId is required'),
  body('scheduledAt')
    .notEmpty()
    .withMessage('scheduledAt is required')
    .isISO8601()
    .withMessage('scheduledAt must be a valid ISO 8601 date'),
  validate,
];
