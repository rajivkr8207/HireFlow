import mongoose from 'mongoose';
import Config from './config.js';
import logger from './logger.js';

export const ConnectDB = async () => {
  try {
    await mongoose.connect(Config.mongodb_uri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error}`);
  }
};
