import {
  publishRelease,
  PublishReleaseOptions,
} from "../use-cases/publish-release";
import { handleCommand } from "../utils/command";
import {
  BASE_OPTIONS_RELEASE,
  createCommand,
  transformReleaseOptionsArgs,
} from "./base";

export const publishReleaseCommand = createCommand({
  name: "publish",
  description: "creates a release, makes a patch and uploads it automatically",
  usesAuth: true,
  baseOptions: BASE_OPTIONS_RELEASE,
})
  .option("-n, --notes <string>", "notes")
  .requiredOption("--path <string>", "path to new release (packed)")
  .option("--ignore_hash", "ignore checksum")
  .action(
    handleCommand<PublishReleaseOptions>(publishRelease, (args) => ({
      ...transformReleaseOptionsArgs(args),
      pathPrevious: args["path_previous"],
      ignoreHash: !!args["ignore_hash"],
    })),
  );
