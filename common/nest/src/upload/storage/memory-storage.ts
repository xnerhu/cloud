import { StorageFile, Storage } from "./storage";

export interface MemoryStorageFile extends StorageFile {
  buffer: Buffer;
}

export type MemoryStorage = Storage<MemoryStorageFile>;

export const memoryStorage = (): MemoryStorage => {
  return {
    handleFile: async (file) => {
      const buffer = await file.toBuffer();

      return {
        buffer,
        size: buffer.length,
        file,
      };
    },
    removeFile: (file) => {
      delete (file as any).buffer;
    },
  };
};
