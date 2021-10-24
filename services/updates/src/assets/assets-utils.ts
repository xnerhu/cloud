import { BadRequestException } from "@nestjs/common";
import hashFile from "md5-file";
import { extname } from "path";
import { AssetType } from "@core/updates";

export const verifyAssetHash = async (path: string, remoteHash: string) => {
  const localHash = await hashFile(path);

  if (localHash !== remoteHash) {
    throw new BadRequestException(
      `File is corrupted. Expected ${remoteHash}, got: ${localHash}`,
    );
  }
};

export const getAssetExtension = (path: string, type: AssetType) => {
  if (type === AssetType.INSTALLER) {
    return extname(path);
  }

  if (type === AssetType.PATCH) {
    return ".patch";
  }

  if (type === AssetType.PACKED) {
    return ".packed.7z";
  }

  throw new Error(`No file extension for asset type ${type} found`);
};
