import { Asset } from "@core/updates";
import { NotFoundError } from "@mikro-orm/core";
import { UpdateStrategy } from "@network/updates-api";

type GetUpdateStrategyAsset = Pick<Asset, "size">;

export const getUpdateStrategy = (
  packed: GetUpdateStrategyAsset,
  patches: GetUpdateStrategyAsset[],
): UpdateStrategy => {
  if (!packed || patches.length === 0) {
    throw new NotFoundError("No update strategy available");
  }

  const patchesSize = patches.reduce((sum, r) => sum + r.size, 0);

  return patchesSize >= packed.size ? "packed" : "patches";
};
