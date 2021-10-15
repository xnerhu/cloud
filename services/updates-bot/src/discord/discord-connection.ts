import { ConfigService } from "@nestjs/config";
import { Client, Intents } from "discord.js";

export const DISCORD_CONNECTION = "DISCORD_CONNECTION";

export const discordConnectionFactory = {
  provide: DISCORD_CONNECTION,
  useFactory: async (config: ConfigService) => {
    const client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });

    await client.login(config.get<string>("DISCORD_TOKEN"));

    return client;
  },
  inject: [ConfigService],
};
