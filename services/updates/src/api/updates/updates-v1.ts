import {
  UpdateResponse,
  UpdateV1Response,
  UpdateEntry,
  UpdateEntryV1,
  UpdateV1Strategy,
  UpdateStrategy,
} from "@network/updates-api";

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
    return { type: "none" };
  }

  const resV1: UpdateV1Response = {
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
}: UpdateEntry): UpdateEntryV1 => {
  return { filename, url };
};
