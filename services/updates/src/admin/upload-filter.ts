import { DiskStorageFile, UploadFilterHandler } from "@common/nest";

const MIMETYPES = ["application/octet-stream", "application/x-7z-compressed"];

export const uploadFilter: UploadFilterHandler = (
  req,
  file: DiskStorageFile,
) => {
  if (!MIMETYPES.includes(file.mimetype)) {
    return "Incorrect file format";
  }

  return true;
};
