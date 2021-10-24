import chalk from "chalk";

export const info = (...args: string[]) => {
  console.log(chalk.whiteBright(args));
};

export const warn = (...args: string[]) => {
  console.log(chalk.yellowBright(args));
};

export const success = (...args: string[]) => {
  console.log(chalk.greenBright(args));
};
