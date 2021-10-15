import "jest";

import { makeId } from "../string";

describe("@common/node string", () => {
  describe("makeId", () => {
    it("returns a random string", async () => {
      expect(await makeId(12)).toHaveLength(12);
    });

    it("returns a random string with given length", async () => {
      expect(await makeId(7)).toHaveLength(7);
    });
  });
});
