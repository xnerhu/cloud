import { createRelease } from "../use-cases/create-release";
import { handleCommand } from "../utils/command";
import {
  BASE_OPTIONS_RELEASE,
  createCommand,
  transformReleaseOptionsArgs,
} from "./base";

export const createReleaseCommand = createCommand({
  name: "create",
  description: "creates a new release, if doesn't exists",
  usesAuth: true,
  baseOptions: BASE_OPTIONS_RELEASE,
})
  .option("-n, --notes <string>", "notes")
  .action(handleCommand(createRelease, transformReleaseOptionsArgs));
