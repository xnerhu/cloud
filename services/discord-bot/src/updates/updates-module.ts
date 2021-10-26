import { Module } from "@nestjs/common";

import { UpdatesController } from "./updates-controller";
import { UpdatesService } from "./updates-service";
import { ConfigModule } from "../config/config-module";
import { ClientModule } from "../client/client-module";

@Module({
  imports: [ClientModule, ConfigModule],
  providers: [UpdatesService],
  controllers: [UpdatesController],
})
export class UpdatesModule {}
