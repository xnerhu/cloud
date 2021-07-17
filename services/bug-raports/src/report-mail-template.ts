import { ReportModel } from './interfaces/report';

export const reportMailTemplate = ({
  description,
  url,
  email,
  wexondVersion,
  chromiumVersion,
  userAgent,
}: ReportModel) =>
  `${description}\n\nURL: ${url}\nUser Agent: ${userAgent}\nWexond Version: ${wexondVersion}\nChromium Version: ${chromiumVersion}\n${
    email != null ? `From: ${email}` : ''
  }
`.trim();
