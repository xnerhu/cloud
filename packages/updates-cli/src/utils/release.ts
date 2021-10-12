import { readdir } from "fs/promises";
import { extname, resolve } from "path";
import { makeId } from "@common/node";

import { unpack7z } from "./unpack";

export const unpackRelease = async (dir: string, path: string) => {
  const unpackDirPath = resolve(dir, await makeId());

  await unpack7z(path, unpackDirPath);

  const files = await readdir(unpackDirPath);
  const files7z = files.filter((file) => extname(file) === ".7z");

  if (files7z.length === 0) {
    throw new Error("No files found");
  } else if (files7z.length > 1) {
    throw new Error(`Too many files found (${files7z})`);
  }

  const [unpackedFilename] = files7z;
  const unpackedFilePath = resolve(unpackDirPath, unpackedFilename);

  return { dir: unpackDirPath, path: unpackedFilePath };
};
