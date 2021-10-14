import axios from "axios";
import hashFile from "md5-file";
import FormData from "form-data";
import { createReadStream } from "fs";
import { getFileSize } from "@common/node";

import { info, infoRes } from "../utils/logger";
import { UseCaseOptions } from "./base";
import { getAdminUrl, getAuthHeaders } from "../utils";

export type UploadPatchOptions = UseCaseOptions<{
  patch: string;
  packed: string;
  release: number;
  distribution: number;
}>;

export const uploadPatch = async ({
  api,
  token,
  patch,
  packed,
  release,
  distribution,
}: UploadPatchOptions) => {
  info(`Uploading patch at ${patch} and packed at ${packed}`);

  const [patchHash, fullHash, patchSize, packedSize] = await Promise.all([
    hashFile(patch),
    hashFile(packed),
    getFileSize(patch),
    getFileSize(packed),
  ]);

  if (patchSize > packedSize) {
    throw new Error("Patch is bigger than packed");
  }

  const data = new FormData();

  data.append("patch", createReadStream(patch));
  data.append("full", createReadStream(packed));
  data.append("releaseId", release);
  data.append("distributionId", distribution);
  data.append("hash", patchHash);
  data.append("fullHash", fullHash);

  const res = await axios({
    method: "put",
    url: getAdminUrl(api, "patch"),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: { ...getAuthHeaders(token), ...data.getHeaders() },
    data,
  });

  infoRes(JSON.stringify(res.data));

  return res.data;
};
