import { MultipartFile } from "fastify-multipart";
import { FastifyRequest } from "fastify";
import { tmpdir } from "os";
import { createWriteStream } from "fs";
import { mkdir, unlink } from "fs/promises";
import { Server, IncomingMessage } from "http";
import { join } from "path";
import { RouteGenericInterface } from "fastify/types/route";
import { getUniqueFilename, pathExists, pump } from "@common/node";

import { StorageFile, Storage } from "./storage";

export interface DiskStorageFile extends StorageFile {
  dest: string;
  filename: string;
  originalFilename: string;
  path: string;
}

type DiskStorageOptionHandler =
  | ((file: MultipartFile, req: FastifyRequest) => Promise<string> | string)
  | string;

export interface DiskStorageOptions {
  dest?: DiskStorageOptionHandler;
  filename?: DiskStorageOptionHandler;
  removeAfter?: boolean;
}

const getFileDestination = async (
  file: MultipartFile,
  req: FastifyRequest,
  obj?: DiskStorageOptionHandler,
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
  obj?: DiskStorageOptionHandler,
): Promise<string> => {
  if (typeof obj === "function") {
    return obj(file, req);
  }

  if (obj != null) return obj;

  return getUniqueFilename(file.filename);
};

export class DiskStorage
  implements Storage<DiskStorageFile, DiskStorageOptions>
{
  constructor(public readonly options?: DiskStorageOptions) {}

  public async handleFile(
    file: MultipartFile,
    req: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>,
  ) {
    const filename = await getFilename(file, req, this.options?.filename);
    const dest = await getFileDestination(file, req, this.options?.dest);

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
  }

  public async removeFile(file: DiskStorageFile) {
    if (!this.options?.removeAfter) return;

    await unlink(file.path);
  }
}
