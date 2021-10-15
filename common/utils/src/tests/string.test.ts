import "jest";

import { makeId, capitalizeFirstLetter } from "../";

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
});
