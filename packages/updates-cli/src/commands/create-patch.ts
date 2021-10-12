import { createPatch, CreatePatchOptions } from "../use-cases/create-patch";
import { handleCommand } from "../utils/command";
import { createCommand } from "./base";

export const createPatchCommand = createCommand(
  "patch",
  "creates a patch for a release",
  false,
)
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
    handleCommand<CreatePatchOptions>(createPatch, (args) => ({
      ...args,
      pathPrevious: args["path_previous"],
    })),
  );
