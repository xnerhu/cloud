export interface MailModel {
  to: string;
  subject: string;
  text: string;
  attachments?: MailAttachmentModel[];
}

export interface MailAttachmentModel {
  filename: string;
  content: Buffer;
}
