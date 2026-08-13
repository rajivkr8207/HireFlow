import express from 'express';
import { healthCheck, readyCheck } from './health.controller.js';

const healthRoute = express.Router();

healthRoute.get('/', healthCheck);

healthRoute.get('/ready', readyCheck);

export default healthRoute;
