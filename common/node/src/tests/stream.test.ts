import "jest";
import { resolve } from "path";
import hashFile from "md5-file";

import { pump } from "../stream";
import { createReadStream, createWriteStream } from "fs";

describe("@common/node stream", () => {
  describe("pump", () => {
    it("handles pumping readable into writable stream", async () => {
      const srcPath = resolve(__dirname, "assets/test-file.txt");
      const dstPath = resolve(__dirname, Date.now().toString());

      const readable = createReadStream(srcPath, "utf8");
      const writable = createWriteStream(resolve(dstPath), "utf8");

      await pump(readable, writable);

      const [srcHash, dstHash] = await Promise.all([
        hashFile(srcPath),
        hashFile(dstPath),
      ]);

      expect(srcHash).toEqual(dstHash);
    });
  });
});
