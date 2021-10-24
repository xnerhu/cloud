import { AxiosError } from "axios";
import chalk from "chalk";
import { Command, Option } from "commander";

export const handleCommand =
  <T extends Record<string, any>>(
    fn: (args: T) => Promise<any>,
    ...transformers: Array<(args: Record<string, string>) => Partial<T>>
  ) =>
  async (args: Record<string, string>) => {
    try {
      let argsMap: Record<string, any> = { ...args };

      transformers.forEach((transformer) => {
        argsMap = transformer(argsMap);
      });

      await fn(argsMap as T);
    } catch (error) {
      const err = error as AxiosError;

      if (err.isAxiosError) {
        console.log(chalk.redBright(err.message));

        if (err.response?.data) {
          console.log(chalk.redBright(JSON.stringify(err.response.data)));
        }

        process.exit(1);
      } else {
        throw err;
      }
    }
  };

export const createCommand = (command: Command, options?: Option[]) => {
  if (options) {
    options.forEach((r) => command.addOption(r));
  }

  return command;
};

export const createRequiredOption = (
  flags: string,
  description: string,
  defaultValue?: any,
) => {
  const option = new Option(flags, description);

  option.required = true;

  if (defaultValue != null) {
    option.default(defaultValue);
  }

  return option;
};
