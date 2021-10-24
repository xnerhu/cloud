import axios from "axios";
import { CreateReleaseDto, ReleaseSearchOptions } from "@network/updates-api";

import { getAdminUrl, getAuthHeaders, info, success, warn } from "../../utils";
import { UseCaseAuthOptions } from "../base";

export interface ReleaseCreateOptions
  extends ReleaseSearchOptions,
    UseCaseAuthOptions {
  notes?: string;
}

export const releaseCreate = async ({
  api,
  token,
  channel,
  notes,
  version,
}: ReleaseCreateOptions) => {
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
    warn("Release already exists.");
  } else {
    info("Release created");
  }

  const id = res.data.releaseId;

  success("Release id: " + id);

  return id as number;
};
