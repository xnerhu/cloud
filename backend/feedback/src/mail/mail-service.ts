import { createTransport, Transporter, SentMessageInfo } from 'nodemailer';
import { ServiceLogger } from '@backend/common';

import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_AUTH_USER,
  SMTP_AUTH_PASSWORD,
} from '../constants/config';

export class MailService {
  private transporter: Transporter;

  constructor(private logger: ServiceLogger) {}

  public init() {
    this.transporter = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      service: 'gmail',
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_AUTH_USER,
        pass: SMTP_AUTH_PASSWORD,
      },
    });
  }

  public async send(info: SentMessageInfo) {
    await this.transporter.sendMail(info);
    this.logger.info(`Report email send successfully`);
  }
}
