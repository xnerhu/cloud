import { Command, Option } from "commander";

export const createCommand = (
  name: string,
  description: string,
  auth = true,
) => {
  const instance = new Command().command(name).description(description);

  if (auth) {
    return instance
      .requiredOption("-a, --api <string>", "API endpoint")
      .requiredOption("-x, --token <string>", "API access token");
  }

  return instance;
};

const createRequiredOption = (flags: string, description: string) => {
  const option = new Option(flags, description);

  option.required = true;

  return option;
};

export const OPTION_TAG = createRequiredOption(
  "-t, --tag <string>",
  "version tag",
);

export const OPTION_CHANNEL = createRequiredOption(
  "-c, --channel <string>",
  "release channel",
);
