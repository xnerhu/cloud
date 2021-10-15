import "jest";
import { mocked } from "ts-jest/utils";
import fs from "fs/promises";

import {
  pathExists,
  ensureDir,
  ensureFile,
  getUniqueFilename,
  getFileSize,
} from "../";

jest.mock("fs/promises");

const mockedFs = mocked(fs, true);

describe("@common/node fs", () => {
  describe("pathExists", () => {
    it("returns true if path exists", async () => {
      mockedFs.stat.mockResolvedValue({} as any);

      expect(await pathExists("PATH")).toEqual(true);
    });

    it("returns false if path doesn't exists", async () => {
      mockedFs.stat.mockRejectedValue({} as any);

      expect(await pathExists("PATH")).toEqual(false);
    });
  });

  describe("ensureDir", () => {
    it("check if path exists", async () => {
      mockedFs.stat.mockRejectedValue({} as any);

      await ensureDir("dir_path");

      expect(mockedFs.stat).toHaveBeenCalledWith("dir_path");
    });

    it("doesn't call mkdir if path exists", async () => {
      mockedFs.stat.mockResolvedValue({} as any);

      await ensureDir("dir_path");

      expect(mockedFs.mkdir).not.toHaveBeenCalledWith();
    });

    it("creates directory tree if path doesn't exists", async () => {
      mockedFs.stat.mockRejectedValue({} as any);

      await ensureDir("dir_path");

      expect(mockedFs.mkdir).toHaveBeenCalledWith("dir_path", {
        recursive: true,
      });
    });
  });

  describe("ensureFile", () => {
    it("check if path exists", async () => {
      mockedFs.stat.mockRejectedValue({} as any);

      await ensureFile("dst_path", "src_path");

      expect(mockedFs.stat).toHaveBeenCalledWith("dst_path");
    });

    it("doesn't copy file if path exists", async () => {
      mockedFs.stat.mockResolvedValue({} as any);

      await ensureFile("dst_path", "src_path");

      expect(mockedFs.copyFile).not.toHaveBeenCalledWith();
    });

    it("copies a file from src if path doesn't exists", async () => {
      mockedFs.stat.mockRejectedValue({} as any);

      await ensureFile("dst_path", "src_path");

      expect(mockedFs.copyFile).toHaveBeenCalledWith("src_path", "dst_path");
    });
  });

  describe("getUniqueFilename", () => {
    it("returns a random filename with provided extension", async () => {
      const res = await getUniqueFilename("/var/www/path/filename_path.mp4");

      expect(res.endsWith(".mp4")).toEqual(true);
    });
  });

  describe("getFileSize", () => {
    it("returns size of a file", async () => {
      mockedFs.stat.mockResolvedValue({ size: 1024 } as any);

      const res = await getFileSize("file_path");

      expect(res).toEqual(1024);
      expect(mockedFs.stat).toHaveBeenCalledWith("file_path");
    });
  });
});
