import { unlink } from "fs/promises";
import { tmpdir } from "os";
import { resolve } from "path";
import { makeId, pathExists } from "@common/node";
import {
  DistributionSearchOptions,
  ReleaseSearchOptions,
} from "@network/updates-api";

import { info } from "../utils/logger";
import { unpackRelease } from "../utils/release";
import { UseCaseOptions } from "./base";
import { createPatch } from "./create-patch";
import { createRelease } from "./create-release";
import { fetchDiff } from "./fetch-diff";
import { uploadPatch } from "./upload-patch";

export type PublishReleaseOptions = UseCaseOptions<
  {
    notes?: string;
    path: string;
    ignoreHash?: boolean;
  } & ReleaseSearchOptions &
    DistributionSearchOptions
>;

export const publishRelease = async ({
  api,
  token,
  channel,
  version,
  notes,
  path,
  ignoreHash,
  ...distribution
}: PublishReleaseOptions) => {
  if (!(await pathExists(path))) {
    throw new Error(`Can't find release at ${path}`);
  }

  const { path: unpackedPath } = await unpackRelease(tmpdir(), path);

  info(`Unpacked release at ${unpackedPath}`);

  await createRelease({
    api,
    channel,
    version,
    token,
    notes,
  });

  const diff = await fetchDiff({
    api,
    channel,
    token,
    version,
    ignoreHash,
    ...distribution,
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
    packed: path,
    patch,
    version,
    channel,
    ...distribution,
  });

  await Promise.all([patchPath, unpackedPath].map((path) => unlink(path)));
};
