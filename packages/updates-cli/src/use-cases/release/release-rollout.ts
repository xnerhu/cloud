import axios, { AxiosResponse } from "axios";
import {
  AdminChangeStatusResponse,
  AdminReleaseRolloutDto,
  ReleaseSearchOptions,
} from "@network/updates-api";

import { getAdminUrl, getAuthHeaders, info, warn } from "../../utils";
import { UseCaseAuthOptions } from "../base";

export interface ReleaseRolloutOptions
  extends ReleaseSearchOptions,
    UseCaseAuthOptions {}

export const releaseRollout = async ({
  api,
  token,
  channel,
  version,
}: ReleaseRolloutOptions) => {
  const res = await axios.post<
    AdminReleaseRolloutDto,
    AxiosResponse<AdminChangeStatusResponse>
  >(
    getAdminUrl(api, "rollout"),
    {
      version,
      channel,
    },
    { headers: getAuthHeaders(token) },
  );

  if (!res.data.changed) {
    warn("Release is already rolled out.");
  } else {
    info("Release successfully rolled out.");
  }

  return res.data.changed;
};
