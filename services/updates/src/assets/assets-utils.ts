import { BadRequestException } from "@nestjs/common";
import hashFile from "md5-file";
import { AssetType } from "@core/updates";

export const assetTypeToString = (type: AssetType) => {
  return AssetType[type].toLowerCase();
};

export const verifyAssetHash = async (
  path: string,
  remoteHash: string,
  type: AssetType,
) => {
  const localHash = await hashFile(path);

  if (localHash !== remoteHash) {
    throw new BadRequestException(
      `${assetTypeToString(
        type,
      )} is corrupt. Expected ${remoteHash}, got: ${localHash}`,
    );
  }
};
