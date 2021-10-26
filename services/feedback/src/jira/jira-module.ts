import { Module } from "@nestjs/common";

import { ConfigModule } from "../config/config-module";
import { jiraClientFactory } from "./jira-client";

@Module({
  imports: [ConfigModule],
  providers: [jiraClientFactory],
  exports: [jiraClientFactory],
})
export class JiraModule {}
