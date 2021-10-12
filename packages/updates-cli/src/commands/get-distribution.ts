import {
  getDistribution,
  GetDistributionOptions,
} from "../use-cases/get-distribution";
import { handleCommand } from "../utils/command";
import { createCommand } from "./base";

export const getDistributionCommand = createCommand(
  "distribution",
  "finds a matching distribution",
)
  .requiredOption("-o, --os <string>", "operating system name")
  .requiredOption(
    "-s, --os_version <string>",
    "operating system version",
    "any",
  )
  .requiredOption("-a, --architecture <string>", "CPU architecture")
  .action(
    handleCommand<GetDistributionOptions>(getDistribution, (args) => ({
      ...args,
      osVersion: args.os_version,
    })),
  );
