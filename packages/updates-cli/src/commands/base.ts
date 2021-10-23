import { Command, Option } from "commander";

export interface CreateCommandOptions {
  name: string;
  description: string;
  usesAuth?: boolean;
  baseOptions?: Option[];
}

export const createCommand = ({
  name,
  description,
  usesAuth,
  baseOptions,
}: CreateCommandOptions) => {
  const instance = new Command().command(name).description(description);

  if (baseOptions) {
    baseOptions.forEach((option) => {
      instance.addOption(option);
    });
  }

  if (usesAuth) {
    return instance
      .requiredOption("-a, --api <string>", "API endpoint")
      .requiredOption("-x, --token <string>", "API access token");
  }

  return instance;
};

const createRequiredOption = (
  flags: string,
  description: string,
  defaultValue?: any,
) => {
  const option = new Option(flags, description);

  option.required = true;
  option.default(defaultValue);

  return option;
};

export const BASE_OPTIONS_RELEASE = [
  createRequiredOption("-t, --tag <string>", "version"),
  createRequiredOption("-c, --channel <string>", "release channel"),
  createRequiredOption("--os <string>", "operating system name"),
  createRequiredOption(
    "--os_version <string>",
    "operating system version",
    "any",
  ),
  createRequiredOption("-a, --architecture <string>", "CPU architecture"),
];

export const transformReleaseOptionsArgs = (
  args: Record<string, any>,
): Record<string, any> => {
  return {
    ...args,
    osVersion: args["os_version"],
    version: args["tag"],
  };
};
