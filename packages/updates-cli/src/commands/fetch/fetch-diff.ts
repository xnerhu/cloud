import { Command } from "commander";

import { fetchDiff } from "../../use-cases/fetch/fetch-diff";
import { createCommand, handleCommand } from "../../utils";
import {
  OPTIONS_AUTH,
  OPTIONS_DISTRIBUTION_QUERY,
  OPTIONS_RELEASE_QUERY,
  transformDistributionArgs,
  transformReleaseArgs,
} from "../base";

export const commandFetchDiff = createCommand(
  new Command()
    .name("diff")
    .description("downloads a packed file used for making a patch")
    .option("-p, --path <string>", "path where to save")
    .option("--ignore_hash", "ignore checksum")
    .action(
      handleCommand(
        fetchDiff,
        (args) => ({ ...args, ignoreHash: !!args["ignore_hash"] }),
        transformReleaseArgs,
        transformDistributionArgs,
      ),
    ),
  OPTIONS_AUTH.concat(OPTIONS_RELEASE_QUERY).concat(OPTIONS_DISTRIBUTION_QUERY),
);
