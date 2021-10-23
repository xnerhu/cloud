import axios from "axios";
import { CreateReleaseDto, ReleaseSearchOptions } from "@network/updates-api";

import { getAdminUrl, getAuthHeaders } from "../utils";
import { info, infoRes, warn } from "../utils/logger";
import { UseCaseOptions } from "./base";

export type CreateReleaseOptions = UseCaseOptions<
  {
    notes?: string;
  } & ReleaseSearchOptions
>;

export const createRelease = async ({
  api,
  token,
  channel,
  notes,
  version,
}: CreateReleaseOptions) => {
  info(`Creating new release ${version}-${channel}`);

  const res = await axios.put<any>(
    getAdminUrl(api, "release"),
    {
      version,
      notes,
      channel,
    } as CreateReleaseDto,
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
