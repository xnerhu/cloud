import { DiskStorageFile, UploadFilterHandler } from "@common/nest";

export const uploadsFilter: UploadFilterHandler = (
  req,
  file: DiskStorageFile,
) => {
  return file.mimetype.startsWith("image") || file.mimetype.startsWith("video");
};
