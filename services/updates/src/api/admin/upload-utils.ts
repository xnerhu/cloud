import { AssetType } from "@core/updates";
import { BadRequestException } from "@nestjs/common";
import hashFile from "md5-file";

import { assetTypeToString } from "../../assets/assets-utils";

export const verifyUploadedFile = async (
  path: string,
  controlSum: string,
  type: AssetType,
) => {
  const localHash = await hashFile(path);

  if (localHash !== controlSum) {
    throw new BadRequestException(
      `${assetTypeToString(
        type,
      )} is corrupt. Expected ${controlSum}, got: ${localHash}`,
    );
  }
};
