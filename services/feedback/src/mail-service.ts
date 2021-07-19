import { createTransport, Transporter, SentMessageInfo } from 'nodemailer';
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_AUTH_USER,
  SMTP_AUTH_PASSWORD,
} from './constants/config';
import { Logger } from './logger';

export class MailService {
  public static instance = new MailService();

  private transporter: Transporter;

  public init() {
    this.transporter = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_AUTH_USER,
        pass: SMTP_AUTH_PASSWORD,
      },
    });
  }

  public async send(info: SentMessageInfo) {
    await this.transporter.sendMail(info);
    Logger.instance.info(`Report email send successfully`);
  }
}
