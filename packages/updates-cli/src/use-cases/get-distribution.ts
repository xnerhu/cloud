import axios from "axios";

import { getAdminUrl, getAuthHeaders } from "../utils";
import { info, infoRes } from "../utils/logger";
import { UseCaseOptions } from "./base";

export type GetDistributionOptions = UseCaseOptions<{
  os: string;
  osVersion: string;
  architecture: string;
}>;

export const getDistribution = async ({
  api,
  token,
  architecture,
  os,
  osVersion,
}: GetDistributionOptions) => {
  info(`Searching distribution ${os}-${architecture}-${osVersion}`);

  const res = await axios.get<any>(getAdminUrl(api, "distribution"), {
    params: { architecture, os, osVersion },
    headers: getAuthHeaders(token),
  });

  const id = res.data.distributionId;

  infoRes("Distribution id: " + id);

  return id as number;
};
