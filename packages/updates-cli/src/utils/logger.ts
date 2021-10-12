import chalk from "chalk";

export const info = (...args: string[]) => {
  console.log(chalk.greenBright(args));
};

export const warn = (...args: string[]) => {
  console.log(chalk.yellowBright(args));
};

export const infoRes = (...args: string[]) => {
  console.log(chalk.magentaBright(args));
};
