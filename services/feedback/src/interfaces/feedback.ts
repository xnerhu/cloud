export interface FeedbackModel {
  description: string;
  url: string;
  email?: string;
  screenshot?: Buffer;
  wexondVersion: string;
  chromiumVersion: string;
  userAgent: string;
}
