import axios from "axios";
import hashFile from "md5-file";
import FormData from "form-data";
import Progressbar from "progress";
import { createReadStream } from "fs";
import {
  DistributionSearchOptions,
  ReleaseSearchOptions,
} from "@network/updates-api";
import { AssetType, assetTypeToString } from "@core/updates";

import { getAdminUrl, getAuthHeaders, info, success } from "../../utils";
import { UseCaseAuthOptions } from "../base";
import { validateAssetType } from "../../utils/assets";

export interface UploadAssetOptions
  extends ReleaseSearchOptions,
    DistributionSearchOptions,
    UseCaseAuthOptions {
  type: AssetType;
  path: string;
}

export const uploadAsset = async ({
  api,
  token,
  channel,
  version,
  type,
  path,
  os,
  architecture,
}: UploadAssetOptions) => {
  validateAssetType(type);

  info(`Uploading ${assetTypeToString(type)}`);

  const hash = await hashFile(path);

  const data = new FormData();

  data.append("asset", createReadStream(path));
  data.append("hash", hash);
  data.append("version", version);
  data.append("channel", channel);
  data.append("os", os);
  data.append("architecture", architecture);
  data.append("type", type);

  let progress: Progressbar | undefined = undefined;

  const res = await axios({
    method: "put",
    url: getAdminUrl(api, "asset"),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: { ...getAuthHeaders(token), ...data.getHeaders() },
    data,
    onUploadProgress: (e) => {
      if (!progress) {
        progress = new Progressbar("%s [:bar] :percent :etas", {
          complete: "=",
          incomplete: " ",
          total: e.total,
        });
      }

      progress.tick(e.loaded);
    },
  });

  success(JSON.stringify(res.data));

  return res.data;
};
