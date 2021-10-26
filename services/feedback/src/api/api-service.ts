import { createReadStream } from "fs";
import { Inject, Injectable } from "@nestjs/common";
import { DiskStorageFile } from "@common/nest";
import {
  BrowserFeedbackDto,
  BrowserFeedbackResponse,
} from "@network/feedback-api";
import { JiraClient } from "@libs/jira-api";

import { ConfigService } from "../config/config-service";
import { JIRA_CLIENT_TOKEN } from "../jira/jira-client";
import { jiraDescriptionTemplate, jiraSummaryTemplate } from "./jira-templates";
import { getJiraIssueLabels, getJiraIssueType } from "./jira-utils";

export interface ReleaseSearchOptions {
  version: string;
  channel: string;
  distributionId: number;
}

@Injectable()
export class ApiService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(JIRA_CLIENT_TOKEN) private readonly jiraClient: JiraClient,
  ) {}

  public async browserFeedback(
    data: BrowserFeedbackDto,
    files: DiskStorageFile[],
  ): Promise<BrowserFeedbackResponse> {
    const res = await this.jiraClient.createIssue({
      project: { key: this.configService.jiraProject },
      summary: jiraSummaryTemplate(data),
      description: jiraDescriptionTemplate(data),
      issuetype: {
        name: getJiraIssueType(data.type),
      },
      labels: getJiraIssueLabels(data),
    });

    const streams = files.map((file) => createReadStream(file.path));

    await this.jiraClient.addIssueAttachment(res.id, ...streams);

    return {
      success: true,
      message:
        "Thank you for submiting your feedback! If you provided email, we may contact you.",
    };
  }
}
