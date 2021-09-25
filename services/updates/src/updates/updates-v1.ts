import {
  UpdateResponse,
  UpdateV1Response,
  UpdateEntry,
  UpdateEntryV1,
} from "./updates-response";

export const transformUpdateResV1 = (res: UpdateResponse): UpdateV1Response => {
  if (res.strategy === "none") {
    return { type: "none" };
  }

  const resV1: UpdateV1Response = {
    type: res.strategy,
    fullFile: transformUpdateEntryV1(res.full!),
  };

  if (res.strategy === "full") {
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
