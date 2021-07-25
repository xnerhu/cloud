import { ServiceLogger } from '../logger';

export const handleNodeErrors = (logger: ServiceLogger) => {
  process.on('uncaughtException', (err) => {
    logger.warn(`Uncaught Exception: ${err.message}`);
  });

  process.on('unhandledRejection', (err) => {
    logger.warn(`Unhandled Rejection: ${err}`);
  });
};
