import { Module } from "@nestjs/common";

import { UpdatesController } from "./updates-controller";
import { UpdatesService } from "./updates-service";
import { DiscordModule } from "../discord/discord-module";
import { ConfigModule } from "../config/config-module";

@Module({
  imports: [DiscordModule, ConfigModule],
  providers: [UpdatesService],
  controllers: [UpdatesController],
})
export class UpdatesModule {}
