import { DiskStorageFile, UploadFilterHandler } from "@common/nest";

const MIMETYPES = [
  "application/octet-stream",
  "application/x-7z-compressed",
  "application/x-msdos-program",
  "application/x-debian-package",
  "application/x-apple-diskimage",
];

export const uploadsFilter: UploadFilterHandler = (
  req,
  file: DiskStorageFile,
) => {
  if (!MIMETYPES.includes(file.mimetype)) {
    return `Incorrect file format ${file.mimetype}`;
  }

  return true;
};
