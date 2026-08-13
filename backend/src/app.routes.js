import express from 'express';
import authRouter from './modules/user/user.route.js';
import healthRoute from './modules/health/health.route.js';
import Candidaterouter from './modules/candidate/candidate.route.js';
import RecruiterRoute from './modules/recuiter/recruiter.route.js';
import JobRouter from './modules/jobposting/jobposting.route.js';
import applicantRouter from './modules/applicant/applicant.route.js';

const AllRoutes = express.Router();

AllRoutes.use('/health', healthRoute);
AllRoutes.use('/auth', authRouter);
AllRoutes.use('/candidate', Candidaterouter);
AllRoutes.use('/recruiter', RecruiterRoute);
AllRoutes.use('/job', JobRouter);
AllRoutes.use('/applicant', applicantRouter);

export { AllRoutes };
