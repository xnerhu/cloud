import "jest";

import { substractArrays, arraySwap } from "../";

describe("@common/utils array", () => {
  describe("substractArrays", () => {
    it("returns substracted array", () => {
      expect(substractArrays([16, 8, 4, 2], [12, 2, 2, 0])).toEqual([
        4, 6, 2, 2,
      ]);
    });
  });

  describe("arraySwap", () => {
    it("returns array with swapped item", () => {
      expect(arraySwap([16, 8, 4, 2], 0, 2)).toEqual([4, 8, 16, 2]);
    });

    it("doesn't mutate the original array", () => {
      const original = [16, 8, 4, 2];
      const originalCopy = original.slice();

      arraySwap(original, 0, 2);

      expect(original).toEqual(originalCopy);
    });
  });
});
