import winston from 'winston';

import { PATH_LOGS } from './constants/paths';

const { combine, timestamp, printf } = winston.format;

const formatWinston = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export class Logger {
  public static instance = new Logger();

  private logger = winston.createLogger({
    format: combine(timestamp(), formatWinston),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: PATH_LOGS }),
    ],
  });

  public info(message: string) {
    this.logger.info(message);
  }

  public warn(message: string) {
    this.logger.info(message);
  }

  public error(message: string) {
    this.logger.error(message);
  }
}
