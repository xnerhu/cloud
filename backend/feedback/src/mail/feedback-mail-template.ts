import { FeedbackModel } from '../interfaces';

export const feedbackMailTemplate = ({
  description,
  url,
  email,
  wexondVersion,
  chromiumVersion,
  userAgent,
  diagnosticData,
}: FeedbackModel) => {
  const infoStr = `
${description}\n\nURL: ${url}\nUser Agent: ${userAgent}\nWexond Version: ${wexondVersion}\nChromium Version: ${chromiumVersion}
`.trim();
  const emailStr = email != null ? `\nFrom: ${email}` : '';
  const diagnosticStr =
    diagnosticData != null ? `\nDiagnostic data: ${diagnosticData}` : '';

  return `${infoStr}${emailStr}${diagnosticStr}`;
};
