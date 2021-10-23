import axios from "axios";
import hashFile from "md5-file";
import FormData from "form-data";
import { createReadStream } from "fs";
import { getFileSize } from "@common/node";

import { info, infoRes } from "../utils/logger";
import { UseCaseOptions } from "./base";
import { getAdminUrl, getAuthHeaders } from "../utils";
import {
  DistributionSearchOptions,
  ReleaseSearchOptions,
} from "@network/updates-api";

export type UploadPatchOptions = UseCaseOptions<
  {
    patch: string;
    packed: string;
  } & ReleaseSearchOptions &
    DistributionSearchOptions
>;

export const uploadPatch = async ({
  api,
  token,
  patch,
  packed,
  version,
  channel,
  architecture,
  os,
  osVersion,
}: UploadPatchOptions) => {
  info(`Uploading patch at ${patch} and packed at ${packed}`);

  const [patchHash, packedHash, patchSize, packedSize] = await Promise.all([
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
  data.append("packed", createReadStream(packed));
  data.append("patchHash", patchHash);
  data.append("packedHash", packedHash);
  data.append("version", version);
  data.append("channel", channel);
  data.append("os", os);
  data.append("osVersion", osVersion);
  data.append("architecture", architecture);

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
