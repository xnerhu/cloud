import axios from "axios";
import hashFile from "md5-file";
import { createWriteStream } from "fs";
import { tmpdir } from "os";
import { resolve } from "path";
import Progressbar from "progress";
import {
  AdminGetDiffInfoResponse,
  DistributionSearchOptions,
  GetDiffInfoDto,
  ReleaseSearchOptions,
} from "@network/updates-api";
import { downloadFile } from "@common/node";

import {
  getAdminUrl,
  getAuthHeaders,
  info,
  success,
  unpackRelease,
  warn,
} from "../../utils";
import { UseCaseAuthOptions } from "../base";

export interface FetchAssetOptions
  extends ReleaseSearchOptions,
    DistributionSearchOptions,
    UseCaseAuthOptions {
  path?: string;
  ignoreHash?: boolean;
}

const download = async (downloadUrl: string, path: string) => {
  info(`Downloading ${downloadUrl} to ${path}`);

  const { totalBytes, fetch, stream } = await downloadFile(
    downloadUrl,
    createWriteStream(path),
  );

  const progress = new Progressbar("%s [:bar] :percent :etas", {
    complete: "=",
    incomplete: " ",
    total: totalBytes,
  });

  stream.on("data", (chunk: Buffer) => {
    progress.tick(chunk.length);
  });

  await fetch();

  progress.terminate();
};

export const fetchDiff = async ({
  api,
  token,
  channel,
  version,
  path,
  os,
  architecture,
  ignoreHash,
}: FetchAssetOptions) => {
  info(`Fetching diff info for ${version} ${channel} ${os}-${architecture}`);

  const res = await axios.get<any>(getAdminUrl(api, "diff"), {
    params: {
      channel,
      version,
      os,
      architecture,
    } as GetDiffInfoDto,
    headers: getAuthHeaders(token),
  });

  const diffData = res.data;

  success(JSON.stringify(diffData));

  const {
    asset: { url: downloadUrl, filename, hash },
  } = diffData as AdminGetDiffInfoResponse;

  const dirPath = path || tmpdir();
  const filePath = resolve(dirPath, filename);

  await download(downloadUrl, filePath);

  if (ignoreHash) {
    warn("Ignoring checksum");
  } else {
    const localHash = await hashFile(filePath);

    if (localHash !== hash) {
      throw new Error(
        `Checksum of ${filename} is invalid. Local ${localHash}, Remote: ${hash}. Try again.`,
      );
    }
  }

  const { path: unpackedFilePath } = await unpackRelease(dirPath, filePath);

  success(`Unpacked release to ${unpackedFilePath}`);

  return { packedPath: filePath, unpackedPath: unpackedFilePath };
};
