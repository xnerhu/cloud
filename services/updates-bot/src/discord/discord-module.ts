import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { discordConnectionFactory } from "./discord-connection";

@Module({
  imports: [ConfigModule],
  providers: [discordConnectionFactory],
  exports: [discordConnectionFactory],
})
export class DiscordModule {}
