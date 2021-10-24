import { AssetType } from "./asset";

export const assetTypeToString = (type: AssetType) => {
  return AssetType[type].toLowerCase();
};
