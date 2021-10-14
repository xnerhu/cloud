import { uploadPatch, UploadPatchOptions } from "../use-cases/upload-patch";
import { handleCommand } from "../utils/command";
import { createCommand } from "./base";

export const uploadPatchCommand = createCommand(
  "upload",
  "uploads patch and packed",
)
  .requiredOption("-p, --patch <string>", "patch path")
  .requiredOption("-f, --packed <string>", "packed path")
  .requiredOption("-r, --release <number>", "release id")
  .requiredOption("-d, --distribution <number>", "distribution id")
  .action(handleCommand<UploadPatchOptions>(uploadPatch));
