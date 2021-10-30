import {
  UpdateResponse,
  UpdateV1Response,
  UpdateEntryV1,
  UpdateV1Strategy,
  UpdateStrategy,
} from "@network/updates-api";
import { ReleaseAssetFetchInfo } from "@network/updates-api/src/assets-response";

export const transformUpdateStrategyV1 = (
  strategy: UpdateStrategy,
): UpdateV1Strategy => {
  if (strategy === "packed") {
    return "full";
  }
  return strategy;
};

export const transformUpdateResV1 = (res: UpdateResponse): UpdateV1Response => {
  if (res.strategy === "none") {
    return { success: true, type: "none" };
  }

  const resV1: UpdateV1Response = {
    success: true,
    type: transformUpdateStrategyV1(res.strategy),
    fullFile: transformUpdateEntryV1(res.packed!),
  };

  if (res.strategy === "packed") {
    return resV1;
  }

  return {
    ...resV1,
    patches: res.patches!.map((patch) => transformUpdateEntryV1(patch)),
  };
};

export const transformUpdateEntryV1 = ({
  filename,
  url,
}: ReleaseAssetFetchInfo): UpdateEntryV1 => {
  return { filename, url };
};
