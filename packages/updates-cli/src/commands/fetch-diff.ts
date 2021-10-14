import { fetchDiff, FetchDiffOptions } from "../use-cases/fetch-diff";
import { handleCommand } from "../utils/command";
import { createCommand, OPTION_CHANNEL, OPTION_TAG } from "./base";

export const fetchDiffCommand = createCommand(
  "diff",
  "downloads latest release for diffing",
)
  .addOption(OPTION_TAG)
  .addOption(OPTION_CHANNEL)
  .requiredOption("-d, --distribution <number>", "distribution id")
  .option("-p, --path <string>", "path where to save")
  .option("--ignore_hash", "ignore checksum")
  .action(
    handleCommand<FetchDiffOptions>(fetchDiff, (args) => ({
      ...args,
      version: args.tag,
      distributionId: parseInt(args.distribution),
      ignoreHash: !!args.ignore_hash,
    })),
  );
