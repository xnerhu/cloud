import { AxiosError } from "axios";
import chalk from "chalk";

export const handleCommand =
  <T extends Record<string, any>>(
    fn: (args: T) => Promise<any>,
    transformArgs?: (args: Record<string, string>) => Partial<T>,
  ) =>
  async (args: Record<string, string>) => {
    try {
      await fn(
        typeof transformArgs === "function"
          ? transformArgs(args as any)
          : (args as any),
      );
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
