import { Command } from "commander";

import { commandUploadAsset } from "./upload-asset";

export const commandUpload = new Command()
  .name("upload")
  .addCommand(commandUploadAsset);
