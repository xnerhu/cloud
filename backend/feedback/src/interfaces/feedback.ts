export interface FeedbackModel {
  description: string;
  url: string;
  email?: string;
  attachments?: Buffer[];
  wexondVersion: string;
  chromiumVersion: string;
  userAgent: string;
  diagnosticData?: string;
}
