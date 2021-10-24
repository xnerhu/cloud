import { Command } from "commander";
import { AssetType } from "@core/updates";

import { uploadAsset } from "../../use-cases/upload/upload-asset";
import { createCommand, handleCommand } from "../../utils";
import {
  OPTIONS_AUTH,
  OPTIONS_DISTRIBUTION_QUERY,
  OPTIONS_RELEASE_QUERY,
  transformDistributionArgs,
  transformReleaseArgs,
} from "../base";

export const commandUploadAsset = createCommand(
  new Command()
    .name("asset")
    .description("uploads an asset")
    .requiredOption("--path <string>")
    .requiredOption("--type <string>", "asset type")
    .action(
      handleCommand(
        uploadAsset,
        (args) => ({
          ...args,
          type: AssetType[args.type.toUpperCase() as any] as any,
        }),
        transformReleaseArgs,
        transformDistributionArgs,
      ),
    ),
  [...OPTIONS_AUTH, ...OPTIONS_RELEASE_QUERY, ...OPTIONS_DISTRIBUTION_QUERY],
);
