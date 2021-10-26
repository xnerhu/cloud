import { Module } from "@nestjs/common";

import { ConfigModule } from "../config/config-module";
import { JiraModule } from "../jira/jira-module";
import { ApiController } from "./api-controller";
import { ApiService } from "./api-service";

@Module({
  imports: [ConfigModule, JiraModule],
  providers: [ApiService],
  controllers: [ApiController],
})
export class ApiModule {}
