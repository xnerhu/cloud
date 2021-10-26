import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

@Injectable()
export class ConfigService {
  constructor(private readonly env: NestConfigService) {}

  public get jiraHost() {
    return this.env.get<string>("JIRA_HOST")!;
  }

  public get jiraProject() {
    return this.env.get<string>("JIRA_PROJECT_KEY")!;
  }

  public get jiraUsername() {
    return this.env.get<string>("JIRA_USERNAME")!;
  }

  public get jiraPassword() {
    return this.env.get<string>("JIRA_PASSWORD")!;
  }

  public get port() {
    return this.env.get("PORT", { infer: true }) as number;
  }

  public get attachmentsUrl() {
    return this.env.get<string>("ATTACHMENTS_URL")!;
  }
}
