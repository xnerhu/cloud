import "jest";
import { AssetType } from "@core/updates";

import { assetTypeToString } from "../assets-utils";

describe("Assets utils", () => {
  describe("assetTypeToString", () => {
    it("returns corresponding keyword", () => {
      expect(assetTypeToString(AssetType.INSTALLER)).toBe("installer");
      expect(assetTypeToString(AssetType.PATCH)).toBe("patch");
      expect(assetTypeToString(AssetType.PACKED)).toBe("packed");
    });
  });
});
