import { BrowserFeedbackDto } from "@network/feedback-api";
import { capitalizeFirstLetter } from "@common/utils";

export const jiraSummaryTemplate = ({
  summary,
}: Pick<BrowserFeedbackDto, "summary">) => {
  return `${capitalizeFirstLetter(summary.trim())} [Feedback]`;
};

export const jiraDescriptionTemplate = ({
  description,
  chromiumVersion,
  userAgent,
  diagnosticData,
  version,
  channel,
  email,
  url,
}: Pick<
  BrowserFeedbackDto,
  | "description"
  | "chromiumVersion"
  | "userAgent"
  | "diagnosticData"
  | "version"
  | "channel"
  | "email"
  | "url"
>) => {
  const fragments: string[] = [
    `${description.trim()}`,
    `\nWexond Version: ${version}-${channel}`,
    `Chromium version: ${chromiumVersion}`,
    `User Agent: ${userAgent}`,
  ];

  if (url) {
    fragments.push(`URL: ${url}`);
  }

  if (email) {
    fragments.push(`Email: ${email}`);
  }

  if (diagnosticData) {
    fragments.push(`\nDiagnostic: ${diagnosticData}`);
  }

  return fragments.join("\n");
};
