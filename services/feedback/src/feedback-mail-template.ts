import { FeedbackModel } from './interfaces';

export const feedbackMailTemplate = ({
  description,
  url,
  email,
  wexondVersion,
  chromiumVersion,
  userAgent,
  diagnosticData,
}: FeedbackModel) =>
  `${description}\n\nURL: ${url}\nUser Agent: ${userAgent}\nWexond Version: ${wexondVersion}\nChromium Version: ${chromiumVersion}\n${
    email != null ? `From: ${email}` : ''
  }\nDiagnostic data: ${diagnosticData}
`.trim();
