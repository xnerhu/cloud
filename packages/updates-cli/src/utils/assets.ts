import { AssetType } from "@core/updates";

export const validateAssetType = (type: AssetType) => {
  if (AssetType[type] == null) {
    throw new Error(`Asset type ${type} doesn't exists.`);
  }
};
