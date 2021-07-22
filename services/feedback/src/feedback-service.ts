import { fromBuffer } from 'file-type';

import { FEEDBACK_RECIPIENTS } from './constants/config';
import { feedbackMailTemplate } from './feedback-mail-template';
import { FeedbackModel, MailModel } from './interfaces';
import { MailService } from './mail-service';

export class FeedbackService {
  public static instance = new FeedbackService();

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

    await MailService.instance.send(mail);
  }
}
