import { promises as fs } from "fs";
import { extname } from "path";
import { stat } from "fs/promises";

import { randomBytes } from "../crypto";

export const pathExists = async (path: string) => {
  try {
    await fs.stat(path);
  } catch (err) {
    return false;
  }

  return true;
};

export const ensurePath = async (path: string) => {
  if (!(await pathExists(path))) {
    await fs.mkdir(path, { recursive: true });
  }
};

export const ensureFile = async (dst: string, src: string) => {
  if (!(await pathExists(dst))) {
    await fs.copyFile(src, dst);
  }
};

export const getUniqueFilename = async (filename: string) => {
  const buffer = await randomBytes(16);

  const ext = extname(filename);

  return buffer.toString("hex") + ext;
};

export const getFileSize = (path: string) => {
  return stat(path).then((r) => r.size);
};
