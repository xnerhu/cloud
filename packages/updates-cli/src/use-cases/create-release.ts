import axios from "axios";

import { getAdminUrl, getAuthHeaders } from "../utils";
import { info, infoRes, warn } from "../utils/logger";
import { UseCaseOptions } from "./base";

export type CreateReleaseOptions = UseCaseOptions<{
  tag: string;
  channel: string;
  notes?: string;
}>;

export const createRelease = async ({
  api,
  token,
  channel,
  tag,
  notes,
}: CreateReleaseOptions) => {
  info(`Creating new release ${tag}-${channel}`);

  const res = await axios.put<any>(
    getAdminUrl(api, "release"),
    {
      version: tag,
      notes,
      channel,
    },
    { headers: getAuthHeaders(token) },
  );

  if (!res.data.created) {
    warn("Release not created, because it may already exists.");
  } else {
    info("Release created");
  }

  const id = res.data.releaseId;

  infoRes("Release id: " + id);

  return id as number;
};
