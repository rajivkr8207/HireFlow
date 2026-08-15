import { Router } from 'express';
import {
  CancelInterview,
  GetInterview,
  GetInterviewByApplicationController,
  GetMyInterviewsController,
  joinInterview,
  ScheduleInterview,
} from './interview.controller.js';
import { verifyJWT, verifyRecruiter } from '../../middlewares/auth.middleware.js';
import { ScheduleInterviewValidate } from './interview.validate.js';

const interviewRouter = Router();

// Protect all interview routes with verifyJWT
interviewRouter.use(verifyJWT);

interviewRouter.post(
  '/schedule-interview',
  verifyRecruiter,
  ScheduleInterviewValidate,
  ScheduleInterview,
);
interviewRouter.get('/my-interviews', GetMyInterviewsController);
interviewRouter.get('/application/:applicationId', GetInterviewByApplicationController);
interviewRouter.get('/join-interview/:interview_id', joinInterview);
interviewRouter.post('/cancel-interview', CancelInterview);
interviewRouter.get('/get-interview/:interview_id', GetInterview);

export default interviewRouter;
