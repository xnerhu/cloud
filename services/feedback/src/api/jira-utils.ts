import { BrowserFeedbackDto, BrowserFeedbackType } from "@network/feedback-api";

export const getJiraIssueType = (type: BrowserFeedbackType) => {
  return type === BrowserFeedbackType.BUG ? "Bug" : "Feature";
};

export const getJiraIssueLabels = ({
  channel,
  version,
  email,
}: Pick<BrowserFeedbackDto, "version" | "channel" | "email">): string[] => {
  return [
    `${version}-${channel.toLowerCase()}`,
    "feedback",
    "browser",
    email != null ? "contact" : "anonymous",
  ];
};
