import "jest";

import { randomBytes } from "../crypto";

describe("@common/node crypto", () => {
  describe("randomBytes", () => {
    it("returns a buffer", async () => {
      expect(await randomBytes(1)).toBeInstanceOf(Buffer);
    });
  });
});
