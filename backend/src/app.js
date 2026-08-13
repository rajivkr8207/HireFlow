import express from 'express'
import { errorHandler } from './middlewares/error.middleware.js'
import { Middleware } from './app.middleware.js'
import authRouter from './modules/user/user.route.js'
import healthRoute from './modules/health/health.route.js'
import Candidaterouter from './modules/candidate/candidate.route.js'
import RecruiterRoute from './modules/recuiter/recruiter.route.js'
import JobRouter from './modules/jobposting/jobposting.route.js'
import applicantRouter from './modules/applicant/applicant.route.js'
const app = express()

Middleware(app)

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────
app.use('/api/v1/health', healthRoute)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/candidate", Candidaterouter)
app.use("api/v1/recruiter", RecruiterRoute)
app.use("/api/v1/job", JobRouter)
app.use("/api/v1/applicant", applicantRouter)
// ─────────────────────────────────────────────
// GLOBAL ERROR HANDLER  (must be last)
// ─────────────────────────────────────────────
app.use(errorHandler)

export { app }