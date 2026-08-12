import express from "express";
import { RecruiterUpdateValidation, RecruiterValidation } from "./recruiter.validate.js";
import { GetRecruiter, RegisterRecruiter, UpdateRecruiter } from "./recruiter.controller.js";
import { verifyJWT, verifyRecruiter } from "../../middlewares/auth.middleware.js";

const RecruiterRoute = express.Router();

RecruiterRoute.use(verifyJWT);
RecruiterRoute.use(verifyRecruiter);
RecruiterRoute.post("/register", RecruiterValidation, RegisterRecruiter);
RecruiterRoute.get("/", GetRecruiter);
RecruiterRoute.put("/:id", RecruiterUpdateValidation, UpdateRecruiter);

export default RecruiterRoute;