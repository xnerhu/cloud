import "jest";

import { makeId } from "../string";
// warawrawawrr
describe("@common/utils string", () => {
  describe("makeId", () => {
    it("returns a random string", () => {
      expect(makeId(12)).toHaveLength(12);
    });
  });
});
