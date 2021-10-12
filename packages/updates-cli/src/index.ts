import { Command } from "commander";
import chalk from "chalk";

import { createReleaseCommand } from "./commands/create-release";
import { fetchDiffCommand } from "./commands/fetch-diff";
import { getDistributionCommand } from "./commands/get-distribution";
import { createPatchCommand } from "./commands/create-patch";
import { uploadPatchCommand } from "./commands/upload-patch";
import { publishReleaseCommand } from "./commands/publish-release";

const program = new Command();

program
  .version("1.0.0")
  .addCommand(createReleaseCommand)
  .addCommand(getDistributionCommand)
  .addCommand(fetchDiffCommand)
  .addCommand(createPatchCommand)
  .addCommand(uploadPatchCommand)
  .addCommand(publishReleaseCommand)
  .parse(process.argv);

process.on("unhandledRejection", (err) => {
  console.log(chalk.redBright(err));
});
