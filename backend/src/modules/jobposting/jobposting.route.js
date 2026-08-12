import { Router } from "express";
import { ClosejobPostingController, createjobController, deleteJobpostingController, getAllJobPostingController, getJobpostingController, HoldjobPostingController, OpenjobPostingController, updateJobPostingController } from "./jobposting.controller.js";
import { verifyJWT, verifyRecruiter } from "../../middlewares/auth.middleware.js";
import { createjobValidation, updateJobPostingValidation } from "./jobposting.validate.js";

const router = Router();

router.use(verifyJWT)
router.use(verifyRecruiter)
router.post("/create", createjobValidation, createjobController);
router.get("/getAllJobPosting", getAllJobPostingController);
router.put("/updateJobPosting/:id", updateJobPostingValidation, updateJobPostingController);
router.delete("/deleteJobPosting/:id", deleteJobpostingController);
router.get("/getJobposting/:id", getJobpostingController);
router.put("/ClosejobPosting/:id", ClosejobPostingController);
router.put("/OpenjobPosting/:id", OpenjobPostingController);
router.put("/HoldjobPosting/:id", HoldjobPostingController);

export default router;