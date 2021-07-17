import { config } from 'dotenv';

config();

export const SERVICE_PORT = parseInt(process.env.SERVICE_PORT as string);

export const SMTP_HOST = process.env.SMTP_HOST as string;
export const SMTP_PORT = parseInt(process.env.SMTP_PORT as string);

export const SMTP_AUTH_USER = process.env.SMTP_AUTH_USER as string;
export const SMTP_AUTH_PASSWORD = process.env.SMTP_AUTH_PASSWORD as string;

export const FEEDBACK_RECIPIENTS = process.env.FEEDBACK_RECIPIENTS as string;
export const FEEDBACK_RECIPIENTS_LIST = FEEDBACK_RECIPIENTS.split(',');
export const FEEDBACK_SCREENSHOT_MAX_SIZE = parseInt(
  process.env.FEEDBACK_SCREENSHOT_MAX_SIZE as string,
);
