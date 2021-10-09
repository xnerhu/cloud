import execa from "execa";
import { readdirSync } from "fs";
import { resolve } from "path";
import { isCI } from "ci-info";

const main = async () => {
  const testPath = resolve(__dirname, "test.sh");
  const covPath = resolve(__dirname, "codecov.sh");

  try {
    const res = await execa(testPath, []);

    process.stdout.write(res.stdout);
    const env = { CI: true };

    const covRes = await execa(covPath);

    process.stdout.write(covRes.stdout);

    // process.stdout.write(JSON.stringify(readdirSync(resolve(__dirname))));
  } catch (error) {
    process.stderr.write(error.stderr);
    process.stdout.write(error.stdout);
    process.exit(1);
  }

  process.exit(1);
};

main();
