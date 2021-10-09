import "jest";

import { omitNull } from "../object";

describe("@common/utils object", () => {
  describe("omitNull", () => {
    it("removes null properties from object", () => {
      expect(false).toBe(false);
      expect(
        omitNull({
          a: true,
          b: false,
          c: 1024,
          d: null,
          e: undefined,
          f: "test", // xd
        }),
      ).toEqual({
        a: true,
        b: false,
        c: 1024,
        f: "test",
      });
    });
  });
});
