import {
  diskStorage,
  DiskStorage,
  memoryStorage,
  MemoryStorage,
} from "./storage";

export type UploadOptions = busboy.BusboyConfig &
  ({ dest?: string } & { storage?: MemoryStorage | DiskStorage });

export const DEFAULT_UPLOAD_OPTIONS: Partial<UploadOptions> = {
  storage: memoryStorage(),
};

export const transformUploadOptions = (opts?: UploadOptions) => {
  if (opts == null) return DEFAULT_UPLOAD_OPTIONS;

  if (opts.dest != null) {
    return {
      ...opts,
      storage: diskStorage({
        dest: opts.dest,
        ...opts.storage?.options,
      }),
    };
  }

  return { ...DEFAULT_UPLOAD_OPTIONS, ...opts };
};
