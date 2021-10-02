import { UploadFilterHandler } from "@common/nest";

export const uploadFilter: UploadFilterHandler = (req, file) => {
  if (file.encoding !== "7bit") {
    return "File encoding must be 7bit";
  }

  return true;
};
