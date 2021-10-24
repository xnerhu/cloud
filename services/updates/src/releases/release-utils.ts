import { Asset, AssetType } from "@core/updates";

export const validateReleaseRollout = (assets: Asset[]) => {
  const assetMap = new Map<number, AssetType[]>();

  for (const asset of assets) {
    const { id } = asset.distribution;

    const entry = assetMap.get(id);

    if (!entry) {
      assetMap.set(id, [asset.type]);
    } else {
      entry.push(asset.type);
    }
  }

  for (const [key, types] of assetMap) {
    if (!types.includes(AssetType.PACKED)) {
      return `Missing packed file for distribution ${key}`;
    }

    if (!types.includes(AssetType.PATCH)) {
      return `Missing patch file for distribution ${key}`;
    }
  }

  return true;
};
