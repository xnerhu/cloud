import execa from "execa";
import { readdirSync } from "fs";
import { resolve } from "path";

const main = async () => {
  const testPath = resolve(__dirname, "test.sh");

  try {
    const res = await execa(testPath, []);

    process.stdout.write(res.stdout);

    console.log(readdirSync(__dirname));
  } catch (error) {
    process.stderr.write(error.stderr);
    process.stdout.write(error.stdout);
    process.exit(1);
  }
};

main();
