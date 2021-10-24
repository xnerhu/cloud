import { Command } from "commander";

import { makePatch } from "../../use-cases/patch/make-patch";
import { createCommand, handleCommand } from "../../utils";

export const commandMakePatch = createCommand(
  new Command()
    .name("patch")
    .description("creates a patch using zucchini")
    .requiredOption(
      "-p, --path <string>",
      "path to uncompressed new release (packed)",
    )
    .requiredOption(
      "-pp, --path_previous <string>",
      "path to uncompressed previous release (packed)",
    )
    .requiredOption("-o, --out <string>", "where to save patch file")
    .action(
      handleCommand(makePatch, (args) => ({
        ...args,
        pathPrevious: args["path_previous"],
      })),
    ),
);
