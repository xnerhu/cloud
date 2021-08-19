import { fromBuffer } from 'file-type';

import { FEEDBACK_RECIPIENTS } from './constants/config';
import { FeedbackModel, MailModel } from './interfaces';
import { MailService } from './mail/mail-service';
import { feedbackMailTemplate } from './mail/feedback-mail-template';

export class FeedbackService {
  constructor(private mailService: MailService) {}

  public async report(feedback: FeedbackModel) {
    let mail: MailModel = {
      to: FEEDBACK_RECIPIENTS,
      subject: `Wexond Feedback`,
      text: feedbackMailTemplate(feedback),
    };

    if (feedback.attachments != null) {
      const attachments = await Promise.all(
        feedback.attachments.map(async (r) => ({
          filename: `screenshot.${await fromBuffer(r).then((r) => r?.ext)}`,
          content: r,
        })),
      );

      mail = { ...mail, attachments };
    }

    await this.mailService.send(mail);
  }
}
