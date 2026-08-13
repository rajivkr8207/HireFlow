import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import Config from './config/config.js';
import helmet from 'helmet';
import compression from 'compression';

const corsOption = {
  origin: Config.frontend_url,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const Middleware = (app) => {
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true, limit: '16kb' }));
  app.use(cookieParser());
  app.use(cors(corsOption));
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(compression());
  app.use(express.static('public/dist'));
};
