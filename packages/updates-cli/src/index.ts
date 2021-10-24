import { Command } from "commander";
import chalk from "chalk";

import { commandRelease } from "./commands/release";
import { commandFetch } from "./commands/fetch";
import { commandMakePatch } from "./commands/patch";
import { commandUpload } from "./commands/upload";
import { commandPublish } from "./commands/publish";

const program = new Command();

program
  .version("0.0.0-PLACEHOLDER")
  .addCommand(commandRelease)
  .addCommand(commandFetch)
  .addCommand(commandMakePatch)
  .addCommand(commandUpload)
  .addCommand(commandPublish)
  .parse(process.argv);

process.on("unhandledRejection", (err) => {
  console.log(chalk.redBright(err));
});
