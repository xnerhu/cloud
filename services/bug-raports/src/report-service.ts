import { fromBuffer } from 'file-type';

import { RAPORT_RECIPIENTS } from './constants/config';
import { MailModel } from './interfaces';
import { ReportModel } from './interfaces/report';
import { MailService } from './mail-service';
import { reportMailTemplate } from './report-mail-template';

export class ReportService {
  public static instance = new ReportService();

  public async report(report: ReportModel) {
    let mail: MailModel = {
      to: RAPORT_RECIPIENTS,
      subject: `Wexond Bug Report`,
      text: reportMailTemplate(report),
    };

    if (report.screenshot) {
      const type = await fromBuffer(report.screenshot);
      mail = {
        ...mail,
        attachments: [
          {
            filename: `screenshot.${type?.ext}`,
            content: report.screenshot,
          },
        ],
      };
    }

    await MailService.instance.send(mail);
  }
}
