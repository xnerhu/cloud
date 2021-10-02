import { extname } from "path";
import hashFile from "md5-file";

import { Release, Distribution } from "../interfaces";
import { BadRequestException } from "@nestjs/common";

export const getUploadFilename = (release: Release, distro: Distribution) => {
  return `${release.version}_${release.channel}_${distro.os}-${distro.architecture}-${distro.osVersion}`;
};

export const formatUploadFilename = (filename: string, filePath: string) => {
  const ext = extname(filePath);

  return filename + ext;
};

export const verifyUploadFile = async (path: string, controlSum: string) => {
  const localHash = await hashFile(path);

  if (localHash !== controlSum) {
    throw new BadRequestException(
      `File is corrupt. Expected ${controlSum}, got: ${localHash}`,
    );
  }
};
