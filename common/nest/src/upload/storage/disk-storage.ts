import { MultipartFile } from "fastify-multipart";
import { FastifyRequest } from "fastify";
import { tmpdir } from "os";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { join } from "path";
import { getUniqueFilename, pathExists, pump } from "@common/node";

import { StorageFile, Storage } from "./storage";

export interface DiskStorageFile extends StorageFile {
  dest: string;
  filename: string;
  originalFilename: string;
  path: string;
}

type DiskStorageFilePropertyFormater =
  | ((file: MultipartFile, req: FastifyRequest) => Promise<string> | string)
  | string;

export interface DiskStorageOptions {
  dest?: DiskStorageFilePropertyFormater;
  filename?: DiskStorageFilePropertyFormater;
}

const getFileDestination = async (
  file: MultipartFile,
  req: FastifyRequest,
  obj?: DiskStorageFilePropertyFormater,
): Promise<string> => {
  if (typeof obj === "function") {
    return obj(file, req);
  }

  if (obj != null) return obj;

  return tmpdir();
};

const getFilename = async (
  file: MultipartFile,
  req: FastifyRequest,
  obj?: DiskStorageFilePropertyFormater,
): Promise<string> => {
  if (typeof obj === "function") {
    return obj(file, req);
  }

  if (obj != null) return obj;

  return getUniqueFilename(file.filename);
};

export type DiskStorage = Storage<DiskStorageFile, DiskStorageOptions>;

export const diskStorage = (options?: DiskStorageOptions): DiskStorage => {
  return {
    handleFile: async (file, req) => {
      const filename = await getFilename(file, req, options?.filename);
      const dest = await getFileDestination(file, req, options?.dest);

      if (!(await pathExists(dest))) {
        await mkdir(dest, { recursive: true });
      }

      const path = join(dest, filename);
      const stream = createWriteStream(path);

      await pump(file.file, stream);

      return {
        size: stream.bytesWritten,
        dest,
        filename,
        originalFilename: file.filename,
        path,
        file,
      };
    },
    removeFile: (file) => {
      delete (file as any).buffer;
    },
    options,
  };
};
