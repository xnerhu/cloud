import { JiraClient } from "@libs/jira-api";

import { ConfigService } from "../config/config-service";

export const JIRA_CLIENT_TOKEN = "JIRA_CLIENT_PROVIDER";

export const jiraClientFactory = {
  provide: JIRA_CLIENT_TOKEN,
  useFactory: (config: ConfigService) => {
    return new JiraClient({
      host: config.jiraHost,
      auth: {
        username: config.jiraUsername,
        password: config.jiraPassword,
      },
    });
  },
  inject: [ConfigService],
};
