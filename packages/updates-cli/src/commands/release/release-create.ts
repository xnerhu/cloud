import { Command } from "commander";

import { releaseCreate } from "../../use-cases/release/release-create";
import { createCommand, handleCommand } from "../../utils";
import {
  OPTIONS_AUTH,
  OPTIONS_RELEASE_QUERY,
  transformReleaseArgs,
} from "../base";

export const commandReleaseCreate = createCommand(
  new Command()
    .name("create")
    .description("creates a new release")
    .option("-n, --notes <string>", "notes")
    .action(handleCommand(releaseCreate, transformReleaseArgs)),
  OPTIONS_AUTH.concat(OPTIONS_RELEASE_QUERY),
);
