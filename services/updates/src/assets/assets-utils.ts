import { AssetType } from "@core/updates";

export const assetTypeToString = (type: AssetType) => {
  return AssetType[type].toLowerCase();
};
