import { Client, Intents } from "discord.js";

import { ConfigService } from "../config/config-service";

export const CLIENT_CONNECTION = "DISCORD_CONNECTION";

export const clientFactory = {
  provide: CLIENT_CONNECTION,
  useFactory: async (config: ConfigService) => {
    const client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });

    await client.login(config.discordToken);

    return client;
  },
  inject: [ConfigService],
};
