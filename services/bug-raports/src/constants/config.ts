import { config } from 'dotenv';

config();

export const SERVICE_PORT = parseInt(process.env.SERVICE_PORT as string);

export const SMTP_HOST = process.env.SMTP_HOST as string;
export const SMTP_PORT = parseInt(process.env.SMTP_PORT as string);

export const SMTP_AUTH_USER = process.env.SMTP_AUTH_USER as string;
export const SMTP_AUTH_PASSWORD = process.env.SMTP_AUTH_PASSWORD as string;

export const RAPORT_RECIPIENTS = process.env.RAPORT_RECIPIENTS as string;
export const RAPORT_RECIPIENTS_LIST = RAPORT_RECIPIENTS.split(',');
export const RAPORT_SCREENSHOT_MAX_SIZE = parseInt(
  process.env.RAPORT_SCREENSHOT_MAX_SIZE as string,
);
