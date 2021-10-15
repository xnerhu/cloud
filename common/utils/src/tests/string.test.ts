import "jest";

import { makeId, capitalizeFirstLetter } from "../string";

describe("@common/utils string", () => {
  describe("makeId", () => {
    it("returns a random string", () => {
      expect(makeId(12)).toHaveLength(12);
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("returns first upper case letter and rest lower case", () => {
      expect(capitalizeFirstLetter("aBC")).toEqual("Abc");
    });

    it("returns the same string", () => {
      expect(capitalizeFirstLetter("Abc")).toEqual("Abc");
    });
  });
});
