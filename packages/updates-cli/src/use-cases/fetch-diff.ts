import axios from "axios";
import { tmpdir } from "os";
import hashFile from "md5-file";
import { createWriteStream } from "fs";
import { resolve } from "path";
import Progressbar from "progress";
import { downloadFile } from "@common/node";

import { getAdminUrl, getAuthHeaders } from "../utils";
import { info, infoRes, warn } from "../utils/logger";
import { UseCaseOptions } from "./base";
import { unpackRelease } from "../utils/release";

export type FetchDiffOptions = UseCaseOptions<{
  version: string;
  channel: string;
  distributionId: number;
  path?: string;
  ignoreHash?: boolean;
}>;

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
  distributionId,
  version,
  path,
  ignoreHash,
}: FetchDiffOptions) => {
  info(`Getting diff info for ${version}-${channel}_${distributionId}`);

  const res = await axios.get<any>(getAdminUrl(api, "diff"), {
    params: { channel, distributionId, version },
    headers: getAuthHeaders(token),
  });

  const diffData = res.data;

  infoRes(JSON.stringify(diffData));

  const { url: downloadUrl, filename, hash } = diffData;

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

  infoRes(`Unpacked release to ${unpackedFilePath}`);

  return { packedPath: filePath, unpackedPath: unpackedFilePath };
};
