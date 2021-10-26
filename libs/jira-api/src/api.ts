import { ReadStream } from "fs";
import JiraApi from "jira-client";

import {
  AuthOptions,
  CreateIssueOptions,
  CreateIssueResponse,
} from "./interfaces";

export interface JiraClientOptions {
  auth: AuthOptions;
  host: string;
}

export class JiraClient {
  private readonly client: JiraApi;

  constructor(private readonly options: JiraClientOptions) {
    this.client = new JiraApi({
      host: options.host,
      protocol: "https",
      username: options.auth.username,
      password: options.auth.password,
      apiVersion: "2",
      strictSSL: true,
    });
  }

  public createIssue(
    options: CreateIssueOptions,
  ): Promise<CreateIssueResponse> {
    return this.client.addNewIssue({ fields: { ...options } }) as any;
  }

  public async addIssueAttachment(issueId: string, ...streams: ReadStream[]) {
    return await Promise.all(
      streams.map((stream) =>
        this.client.addAttachmentOnIssue(issueId, stream),
      ),
    );
  }
}
