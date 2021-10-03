import "jest";

import { makeId } from "../string";

describe("@common/utils string", () => {
  describe("makeId", () => {
    it("returns a random string", () => {
      expect(makeId(12)).toHaveLength(12);
    });
  });
});
