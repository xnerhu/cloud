import { Command } from "commander";

import { publish } from "../../use-cases/publish";
import { createCommand, handleCommand } from "../../utils";
import {
  OPTIONS_AUTH,
  OPTIONS_RELEASE_QUERY,
  OPTIONS_DISTRIBUTION_QUERY,
  transformDistributionArgs,
  transformReleaseArgs,
} from "../base";

export const commandPublish = createCommand(
  new Command()
    .name("publish")
    .requiredOption("-p, --path <string>", "path to new release (packed)")
    .requiredOption("-i, --installer <string>", "path to installer file")
    .option("--ignore_hash", "ignore checksum")
    .option("-n, --notes <string>", "notes")
    .action(
      handleCommand(
        publish,
        (args) => ({ ...args, ignoreHash: !!args["ignore_hash"] }),
        transformReleaseArgs,
        transformDistributionArgs,
      ),
    ),
  OPTIONS_AUTH.concat(OPTIONS_RELEASE_QUERY).concat(OPTIONS_DISTRIBUTION_QUERY),
);
