import { promises as fs } from "fs";

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
