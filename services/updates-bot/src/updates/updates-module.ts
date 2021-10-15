import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { UpdatesController } from "./updates-controller";
import { UpdatesService } from "./updates-service";
import { DiscordModule } from "../discord/discord-module";

@Module({
  imports: [DiscordModule, ConfigModule],
  providers: [UpdatesService],
  controllers: [UpdatesController],
})
export class UpdatesModule {}
