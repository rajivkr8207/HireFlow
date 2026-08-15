import { Router } from 'express';
import { verifyJWT, verifyCandidate } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { applyJobValidation, getAllJobsValidation } from './applicant.validate.js';
import {
  getAllJobsController,
  applyJobController,
  getMyApplicationsController,
  withdrawApplicationController,
} from './applicant.controller.js';

const applicantRouter = Router();
// All applicant routes require a verified JWT and candidate role
applicantRouter.use(verifyJWT);
applicantRouter.use(verifyCandidate);

// Browse all open jobs with pagination & filters
applicantRouter.get('/jobs', getAllJobsValidation, getAllJobsController);

// Submit a job application (supports resume file upload via multer -> ImageKit + ATS score)
applicantRouter.post('/apply', upload.single('resumeFile'), applyJobValidation, applyJobController);

// View own applications with pagination & ATS scores
applicantRouter.get('/my-applications', getMyApplicationsController);

// Withdraw a specific application
applicantRouter.patch('/withdraw/:id', withdrawApplicationController);

export default applicantRouter;
