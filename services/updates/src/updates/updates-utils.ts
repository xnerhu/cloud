import { getUpdateDownloadUrl } from "../files/file-utils";
import { PatchEntry } from "../patches/patches-service";
import { UpdateStrategy, UpdateEntry } from "./updates-response";

export const getUpdateStrategy = (
  latest: PatchEntry | undefined,
  patches: PatchEntry[],
): UpdateStrategy => {
  if (latest == null) return "none";

  const patchesSize = patches.reduce((sum, r) => sum + r.size, 0) + latest.size;

  return patchesSize >= latest.fullSize ? "full" : "patches";
};

export const getUpdateDownloadInfo = (
  entry: PatchEntry,
  isPatch: boolean,
  publicPath: string,
): UpdateEntry => {
  const {
    hash,
    filename,
    fullHash,
    fullFilename,
    notes,
    version,
    size,
    fullSize,
  } = entry;

  const updateEntry = {
    version,
    notes,
  };

  if (isPatch) {
    return {
      ...updateEntry,
      hash,
      size,
      filename,
      url: getUpdateDownloadUrl(filename, publicPath),
    };
  }

  return {
    ...updateEntry,
    hash: fullHash,
    size: fullSize,
    filename: fullFilename,
    url: getUpdateDownloadUrl(fullFilename, publicPath),
  };
};
