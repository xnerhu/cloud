import { Command } from "commander";

import { releaseRollout } from "../../use-cases/release/release-rollout";
import { createCommand, handleCommand } from "../../utils";
import {
  OPTIONS_AUTH,
  OPTIONS_RELEASE_QUERY,
  transformReleaseArgs,
} from "../base";

export const commandReleaseRollout = createCommand(
  new Command()
    .name("rollout")
    .description("deloys a release")
    .action(handleCommand(releaseRollout, transformReleaseArgs)),
  OPTIONS_AUTH.concat(OPTIONS_RELEASE_QUERY),
);
