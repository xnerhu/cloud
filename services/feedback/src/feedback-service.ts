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

    if (feedback.screenshot) {
      const type = await fromBuffer(feedback.screenshot);
      mail = {
        ...mail,
        attachments: [
          {
            filename: `screenshot.${type?.ext}`,
            content: feedback.screenshot,
          },
        ],
      };
    }

    await MailService.instance.send(mail);
  }
}
