import express from 'express';
import {
  GetCandidateController,
  RegisterCandidateController,
  UpdateCandidateController,
} from './candidate.controller.js';
import { verifyCandidate, verifyJWT } from '../../middlewares/auth.middleware.js';
import { CandidateRegisterValidate, CandidateUpdateValidate } from './candidate.validate.js';

const Candidaterouter = express.Router();

Candidaterouter.use(verifyJWT);
Candidaterouter.use(verifyCandidate);
Candidaterouter.post('/register', CandidateRegisterValidate, RegisterCandidateController);
Candidaterouter.get('/:userId', GetCandidateController);
Candidaterouter.put('/:userId', CandidateUpdateValidate, UpdateCandidateController);

export default Candidaterouter;
