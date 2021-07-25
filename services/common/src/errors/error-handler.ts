import { ServiceLogger } from '../logger';
import { AppError } from './app-error';

export class ErrorHandler {
  constructor(protected logger: ServiceLogger) {}

  public handle(err: Error | AppError, statusCode?: number) {
    // Status codes less than 500 are related to bad user input
    // 500 is an internal server error
    if (statusCode != null && statusCode < 500) return true;

    if (!this.isOperational(err)) {
      this.logger.warn(`Exiting process due to programmer error: ${err}`);
      process.exit(1);
    }

    return true;
  }

  private isOperational(err: Error | AppError) {
    if (err instanceof AppError) {
      return err.isOperational;
    }
    return false;
  }
}
