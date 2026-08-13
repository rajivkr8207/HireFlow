import { Router } from "express";
import {
    ClosejobPostingController,
    createjobController,
    deleteJobpostingController,
    getAllJobPostingController,
    getJobpostingController,
    HoldjobPostingController,
    OpenjobPostingController,
    updateJobPostingController,
    getJobApplicantsController,
    updateApplicationStatusController,
} from "./jobposting.controller.js";
import { verifyJWT, verifyRecruiter } from "../../middlewares/auth.middleware.js";
import { createjobValidation, updateJobPostingValidation } from "./jobposting.validate.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyRecruiter);

// Fixed named routes (MUST come before /:id)
router.get("/getAllJobPosting", getAllJobPostingController);
router.get("/", getAllJobPostingController);
router.post("/create", createjobValidation, createjobController);

// Named action routes called by frontend jobService
router.get("/getJobposting/:id", getJobpostingController);
router.put("/updateJobPosting/:id", updateJobPostingValidation, updateJobPostingController);
router.delete("/deleteJobPosting/:id", deleteJobpostingController);
router.put("/ClosejobPosting/:id", ClosejobPostingController);
router.put("/OpenjobPosting/:id", OpenjobPostingController);
router.put("/HoldjobPosting/:id", HoldjobPostingController);
router.put("/Closejob/:id", ClosejobPostingController);
router.put("/Openjob/:id", OpenjobPostingController);
router.put("/Holdjob/:id", HoldjobPostingController);

// Applicants management routes for recruiters
router.get("/:id/applicants", getJobApplicantsController);
router.patch("/application-status/:applicationId", updateApplicationStatusController);

// Parameterized fallback routes
router.get("/:id", getJobpostingController);
router.put("/:id", updateJobPostingValidation, updateJobPostingController);
router.delete("/:id", deleteJobpostingController);

export default router;
