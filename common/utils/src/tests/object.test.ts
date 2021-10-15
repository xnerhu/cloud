import "jest";

import { omitNull, isObjectEmpty } from "../";

describe("@common/utils object", () => {
  describe("omitNull", () => {
    it("removes null properties from object", () => {
      expect(
        omitNull({
          a: true,
          b: false,
          c: 1024,
          d: null,
          e: undefined,
          f: "test",
        }),
      ).toEqual({
        a: true,
        b: false,
        c: 1024,
        f: "test",
      });
    });
  });

  describe("isObjectEmpty", () => {
    it("returns true if object has no keys", () => {
      expect(isObjectEmpty({})).toEqual(true);
    });

    it("returns false if object has keys", () => {
      expect(isObjectEmpty({ a: "b" })).toEqual(false);
    });
  });
});
