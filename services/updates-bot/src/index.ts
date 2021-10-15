// import { REST } from "@discordjs/rest";
// import { Routes } from "discord-api-types/v9";

// const commands = [
//   {
//     name: "ping",
//     description: "Replies with Pong!",
//   },
// ];

// const rest = new REST({ version: "9" }).setToken(
//   "ODk4MjA4MzI3MzEyNDgyMzY2.YWg3sQ.gxwOvzd6uM_Qu1jIJn8p7TfYujk",
// );

// const main = async () => {
//   try {
//     console.log("Started refreshing application (/) commands.");

//     await rest.put(
//       Routes.applicationGuildCommands("898208327312482366", GUILD_ID),
//       {
//         body: commands,
//       },
//     );

//     console.log("Successfully reloaded application (/) commands.");
//   } catch (error) {
//     console.error(error);
//   }
// };

// main();

import "reflect-metadata";

import { runApp } from "./app";

const BOT_TOKEN = "ODk4MjA4MzI3MzEyNDgyMzY2.YWg3sQ.gxwOvzd6uM_Qu1jIJn8p7TfYujk";
const BOT_CHANNEL_ID = "809816247759405086";

const main = async () => {
  await runApp();
  // const adapter = new FastifyAdapter();

  // const config = app.get(ConfigService);
  // const defaultPort = config.get<number>("PORT", { infer: true });

  // const { httpAdapter } = app.get(HttpAdapterHost);

  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // app.register(multipart as any, {});

  // app.enableCors();

  // await app.listen(port ?? defaultPort);

  // const client = new Client({
  //   intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  // });

  // client.on("ready", async (xd) => {
  //   console.log("Bot is ready");
  //   // const channel = <TextChannel>client.channels.resolve(BOT_CHANNEL_ID);

  //   // if (!channel) {
  //   //   throw new Error(`Channel ${BOT_CHANNEL_ID} not found`);
  //   // }

  //   // await channel.send("siema");

  //   // const messages = await channel.messages.fetch({ limit: 16 });

  //   // console.log(messages);

  //   // client.channels.cache.get(BOT_CHANNEL_ID).send
  // });

  // // client.on("message", async (msg) => {

  // //   // const guild = new Guild();
  // //   // const xd = new GuildChannel(msg.guild);
  // //   // console.log(msg.guild?.channels.resolve();
  // //   // console.log(await msg.guild?.channels.resolve(msg.guild.));
  // // });

  // client.login(BOT_TOKEN);
};

main();
