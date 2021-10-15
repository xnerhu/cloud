import { Module } from "@nestjs/common";

import { ConfigModule } from "../config/config-module";
import { discordConnectionFactory } from "./discord-connection";

@Module({
  imports: [ConfigModule],
  providers: [discordConnectionFactory],
  exports: [discordConnectionFactory],
})
export class DiscordModule {}
