import "jest";

import { makeId, capitalizeFirstLetter, replaceAll, hashCode } from "../";

describe("@common/utils string", () => {
  describe("makeId", () => {
    it("returns a random string", () => {
      expect(makeId()).toHaveLength(12);
    });

    it("returns a random string with given length", () => {
      expect(makeId(6)).toHaveLength(6);
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

  describe("replaceAll", () => {
    it("replaces once", () => {
      expect(
        replaceAll("aBc_TOKEN_XYZ", "_TOKEN_", "__INJECTED_TOKEN__"),
      ).toEqual("aBc__INJECTED_TOKEN__XYZ");
    });

    it("replaces multiple times", () => {
      expect(
        replaceAll("aBc_TOKEN_XYZ_TOKEN_deF", "_TOKEN_", "__INJECTED_TOKEN__"),
      ).toEqual("aBc__INJECTED_TOKEN__XYZ__INJECTED_TOKEN__deF");
    });
  });

  describe("hashCode", () => {
    it("returns a hash number of string", () => {
      expect(hashCode("")).toEqual(0);
      expect(hashCode("abcXYZ")).toEqual(-1424397865);
      expect(hashCode("top10")).toEqual(110544436);
    });
  });
});
