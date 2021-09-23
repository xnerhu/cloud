import { PatchDatabaseEntry } from './patches-service';
import { UpdateEntry, UpdateStrategy } from './update-response';

export const getUpdateStrategy = (
  latest: PatchDatabaseEntry | undefined,
  patches: PatchDatabaseEntry[],
): UpdateStrategy => {
  if (latest == null) return 'none';

  const patchesSize = patches.reduce((sum, r) => sum + r.size, 0) + latest.size;

  return patchesSize >= latest.fullSize ? 'full' : 'patches';
};

export const getUpdateEntryFetchInfo = (
  { hash, fullHash, notes, size, version }: PatchDatabaseEntry,
  patch: boolean,
): UpdateEntry => {
  const ext = patch ? 'patch' : 'packed.7z';

  const filename = `${version}.${ext}`;

  return {
    hash: patch ? hash : fullHash,
    notes,
    size,
    version,
    url: `updates.wexond.net/files/${filename}`,
    filename,
  };
};
