import winston from 'winston';

const { combine, timestamp, printf } = winston.format;

const formatMessage = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export class ServiceLogger {
  constructor(private serviceName: string, private logsPath: string) {}

  private logger = winston.createLogger({
    format: combine(timestamp(), formatMessage),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: this.logsPath }),
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
