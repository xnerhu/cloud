import {
  publishRelease,
  PublishReleaseOptions,
} from "../use-cases/publish-release";
import { handleCommand } from "../utils/command";
import { createCommand } from "./base";

export const publishReleaseCommand = createCommand(
  "publish",
  "creates a release, makes a patch and uploads it automatically",
)
  .requiredOption("-t, --tag <string>", "version tag")
  .requiredOption("-c, --channel <string>", "release channel")
  .option("-n, --notes <string>", "notes")
  .requiredOption("-o, --os <string>", "operating system name")
  .requiredOption(
    "-s, --os_version <string>",
    "operating system version",
    "any",
  )
  .requiredOption("-a, --architecture <string>", "CPU architecture")
  .requiredOption("-p, --path <string>", "path to new release (packed)")
  .option("--ignore_hash", "ignore checksum")
  .action(
    handleCommand<PublishReleaseOptions>(publishRelease, (args) => ({
      ...args,
      osVersion: args["os_version"],
      pathPrevious: args["path_previous"],
      ignoreHash: !!args["ignore_hash"],
    })),
  );
