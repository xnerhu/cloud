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

export const getUpdateEntryFetchInfo = (
  { hash, fullHash, notes, size, version }: PatchEntry,
  patch: boolean,
  publicUrl = "",
): UpdateEntry => {
  const ext = patch ? "patch" : "packed.7z";

  const filename = `${version}.${ext}`;

  return {
    hash: patch ? hash : fullHash,
    notes,
    size,
    version,
    url: `${publicUrl}/${filename}`,
    filename,
  };
};
