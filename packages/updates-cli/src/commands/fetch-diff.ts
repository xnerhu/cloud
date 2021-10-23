import { fetchDiff, FetchDiffOptions } from "../use-cases/fetch-diff";
import { handleCommand } from "../utils/command";
import {
  BASE_OPTIONS_RELEASE,
  createCommand,
  transformReleaseOptionsArgs,
} from "./base";

export const fetchDiffCommand = createCommand({
  name: "diff",
  description: "downloads latest release for diffing",
  usesAuth: true,
  baseOptions: BASE_OPTIONS_RELEASE,
})
  .option("-p, --path <string>", "path where to save")
  .option("--ignore_hash", "ignore checksum")
  .action(
    handleCommand<FetchDiffOptions>(fetchDiff, (args) => ({
      ...transformReleaseOptionsArgs(args),
      ignoreHash: !!args.ignore_hash,
    })),
  );
