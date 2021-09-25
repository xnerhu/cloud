import { resolve } from "path";
import execa from "execa";

const main = async () => {
  await execa(
    resolve(__dirname, "../schema_update.sh"),
    ["schema:update", "--run", "--fk-checks"],
    {
      stderr: process.stderr,
      stdout: process.stdout,
      env: {
        MIKRO_ORM_CLI: "services/updates/src/mikro-orm-config.js",
      },
    },
  );
};

export default main;
