import {
  DistributionSearchOptions,
  ReleaseSearchOptions,
} from "@network/updates-api";
import { tmpdir } from "os";
import { makeId, pathExists } from "@common/node";

import { info, unpackRelease } from "../../utils";
import { UseCaseAuthOptions } from "../base";
import { releaseCreate } from "../release/release-create";
import { fetchDiff } from "../fetch/fetch-diff";
import { resolve } from "path";
import { makePatch } from "../patch/make-patch";
import { uploadAsset } from "../upload/upload-asset";
import { AssetType } from "@core/updates";
import { unlink } from "fs/promises";

export interface PublishOptions
  extends ReleaseSearchOptions,
    DistributionSearchOptions,
    UseCaseAuthOptions {
  path: string;
  notes?: string;
  ignoreHash?: boolean;
  installer: string;
}

export const publish = async ({
  api,
  token,
  channel,
  notes,
  version,
  path,
  ignoreHash,
  architecture,
  os,
  installer,
}: PublishOptions) => {
  if (!(await pathExists(path))) {
    throw new Error(`Can't find release at ${path}`);
  }

  const { path: unpackedPath } = await unpackRelease(tmpdir(), path);

  info(`Unpacked release at ${unpackedPath}`);

  await releaseCreate({
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
    architecture,
    os,
  });

  const patchPath = await makePatch({
    path: unpackedPath,
    pathPrevious: diff.unpackedPath,
    out: resolve(tmpdir(), (await makeId()) + ".patch"),
  });

  const uploadOptions = {
    api,
    token,
    version,
    channel,
    architecture,
    os,
  };

  await uploadAsset({
    ...uploadOptions,
    path: patchPath,
    type: AssetType.PATCH,
  });

  await uploadAsset({
    ...uploadOptions,
    path: path,
    type: AssetType.PACKED,
  });

  await uploadAsset({
    ...uploadOptions,
    path: installer,
    type: AssetType.INSTALLER,
  });

  await Promise.all([patchPath, unpackedPath].map((path) => unlink(path)));
};
