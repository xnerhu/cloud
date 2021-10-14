import { makeId, pathExists } from "@common/node";
import { unlink } from "fs/promises";
import { tmpdir } from "os";
import { resolve } from "path";

import { info } from "../utils/logger";
import { unpackRelease } from "../utils/release";
import { UseCaseOptions } from "./base";
import { createPatch } from "./create-patch";
import { createRelease } from "./create-release";
import { fetchDiff } from "./fetch-diff";
import { getDistribution } from "./get-distribution";
import { uploadPatch } from "./upload-patch";

export type PublishReleaseOptions = UseCaseOptions<{
  tag: string;
  channel: string;
  notes?: string;
  os: string;
  osVersion: string;
  architecture: string;
  path: string;
  ignoreHash?: boolean;
}>;

export const publishRelease = async ({
  api,
  token,
  channel,
  tag,
  notes,
  architecture,
  os,
  osVersion,
  path,
  ignoreHash,
}: PublishReleaseOptions) => {
  if (!(await pathExists(path))) {
    throw new Error(`Can't find release at ${path}`);
  }

  const distributionId = await getDistribution({
    api,
    architecture,
    os,
    osVersion,
    token,
  });

  const { path: unpackedPath } = await unpackRelease(tmpdir(), path);

  info(`Unpacked release at ${unpackedPath}`);

  const releaseId = await createRelease({ api, channel, tag, token, notes });

  const diff = await fetchDiff({
    api,
    channel,
    distributionId,
    token,
    version: tag,
    ignoreHash,
  });

  const patchPath = resolve(tmpdir(), (await makeId()) + ".patch");

  const patch = await createPatch({
    path: unpackedPath,
    pathPrevious: diff.unpackedPath,
    out: patchPath,
  });

  await uploadPatch({
    api,
    token,
    distribution: distributionId,
    release: releaseId,
    packed: path,
    patch,
  });

  await Promise.all([patchPath, unpackedPath].map((path) => unlink(path)));
};
