import { resolve } from "path";
import execa from "execa";

export const mikroORM = (cwd: string, _config?: string) => {
  const config = _config
    ? `${_config}/src/mikro-orm-config.js`
    : process.env.MIKRO_ORM_CLI;

  if (!config) throw new Error("Config file not specified");

  const run = (file: string, args: string[]) => {
    return execa(resolve(cwd, file), args, {
      stderr: process.stderr,
      stdout: process.stdout,
      env: {
        MIKRO_ORM_CLI: `${config}/src/mikro-orm-config.js`,
      },
    });
  };

  const DEFAULT_ARGS = ["--run", "--fk-checks"];

  return {
    up: () => run("../schema_up.sh", ["schema:update", ...DEFAULT_ARGS]),
    drop: () =>
      run("../schema_drop.sh", [
        "schema:drop",
        "--drop-migrations-table",
        ...DEFAULT_ARGS,
      ]),
  };
};
