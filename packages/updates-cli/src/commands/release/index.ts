import { Command } from "commander";

import { commandReleaseCreate } from "./release-create";
import { commandReleaseRollout } from "./release-rollout";

export const commandRelease = new Command()
  .name("release")
  .addCommand(commandReleaseCreate)
  .addCommand(commandReleaseRollout);
