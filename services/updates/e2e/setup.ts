import { resolve } from "path";
import { isCI } from "ci-info";

import { mikroORM } from "./mikro-orm";
import seed from "../db/seed";

const main = async () => {
  // return;

  const { up, drop } = mikroORM(resolve(__dirname));

  if (!isCI) {
    await drop();
  }

  await up();
  await seed();
};

export default main;
