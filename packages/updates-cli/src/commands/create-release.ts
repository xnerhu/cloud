import { createRelease } from "../use-cases/create-release";
import { handleCommand } from "../utils/command";
import { createCommand } from "./base";

export const createReleaseCommand = createCommand(
  "create",
  "creates a new release, if doesn't exists",
)
  .requiredOption("-t, --tag <string>", "version tag")
  .requiredOption("-c, --channel <string>", "release channel")
  .option("-n, --notes <string>", "notes")
  .action(handleCommand(createRelease));
