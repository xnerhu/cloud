import { createRequiredOption } from "../utils/command";

export const OPTIONS_AUTH = [
  createRequiredOption("-a, --api <string>", "API endpoint"),
  createRequiredOption("-x, --token <string>", "API access token"),
];

export const OPTIONS_RELEASE_QUERY = [
  createRequiredOption("-t, --tag <string>", "version"),
  createRequiredOption("-c, --channel <string>", "release channel"),
];

export const OPTIONS_DISTRIBUTION_QUERY = [
  createRequiredOption("--os <string>", "operating system name"),
  createRequiredOption("-a, --architecture <string>", "CPU architecture"),
];

export const transformReleaseArgs = (
  args: Record<string, any>,
): Record<string, any> => {
  return { ...args, version: args["tag"] };
};

export const transformDistributionArgs = (
  args: Record<string, any>,
): Record<string, any> => {
  return { ...args, osVersion: args["os_version"] };
};
