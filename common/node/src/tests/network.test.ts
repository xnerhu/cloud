import "jest";
import axios from "axios";
import { mocked } from "ts-jest/utils";
import { resolve } from "path";
import { createReadStream, createWriteStream } from "fs";
import { Readable } from "stream";
import hashFile from "md5-file";

jest.mock("axios");

const mockedAxios = mocked(axios, true);

import { downloadFile } from "../network";

describe("@common/node network", () => {
  describe("downloadFile", () => {
    const remotePath = resolve(__dirname, "assets/test-file.txt");
    const readable = createReadStream(remotePath, "utf8");

    it("downloads a file from url and pipes it to given stream", async () => {
      const localPath = resolve(__dirname, Date.now().toString());
      const writable = createWriteStream(localPath);

      mockedAxios.mockResolvedValue({
        headers: {
          "content-length": "512",
        },
        data: readable,
      } as any);

      const res = await downloadFile("FILE_URL", writable);

      expect(res.totalBytes).toEqual(512);

      expect(res.stream).toBeInstanceOf(Readable);

      expect(mockedAxios).toHaveBeenCalledWith({
        method: "get",
        url: "FILE_URL",
        responseType: "stream",
      });

      await res.fetch();

      const [remoteHash, localHash] = await Promise.all([
        hashFile(remotePath),
        hashFile(localPath),
      ]);

      expect(localHash).toEqual(remoteHash);
    });

    it("handles write stream errors", async () => {
      const localPath = resolve(__dirname, Date.now().toString());
      const writable = createWriteStream(localPath);

      mockedAxios.mockResolvedValue({
        headers: {
          "content-length": "512",
        },
        data: readable,
      } as any);

      writable.on("pipe", () => {
        writable.emit("error", "STREAM_ERROR");
      });

      const res = await downloadFile("FILE_URL", writable);

      expect(res.fetch()).rejects.toEqual("STREAM_ERROR");
    });
  });
});
