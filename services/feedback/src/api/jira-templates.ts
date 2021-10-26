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
}: Pick<
  BrowserFeedbackDto,
  | "description"
  | "chromiumVersion"
  | "userAgent"
  | "diagnosticData"
  | "version"
  | "channel"
>) => {
  const fragments: string[] = [
    `${description.trim()}`,
    `\nWexond Version: ${version}-${channel}`,
    `Chromium version: ${chromiumVersion}`,
    `User Agent: ${userAgent}`,
  ];

  if (diagnosticData) {
    fragments.push(`Diagnostic: ${diagnosticData}`);
  }

  return fragments.join("\n");
};
