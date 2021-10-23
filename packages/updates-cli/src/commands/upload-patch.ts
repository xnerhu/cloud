import { uploadPatch, UploadPatchOptions } from "../use-cases/upload-patch";
import { handleCommand } from "../utils/command";
import {
  BASE_OPTIONS_RELEASE,
  createCommand,
  transformReleaseOptionsArgs,
} from "./base";

export const uploadPatchCommand = createCommand({
  name: "upload",
  description: "uploads patch and packed",
  usesAuth: true,
  baseOptions: BASE_OPTIONS_RELEASE,
})
  .requiredOption("--patch <string>", "patch path")
  .requiredOption("--packed <string>", "packed path")
  .action(
    handleCommand<UploadPatchOptions>(uploadPatch, transformReleaseOptionsArgs),
  );
