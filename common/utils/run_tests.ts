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

    process.stdout.write("XDDD" + process.env.CI);

    // const covRes = await execa(
    //   covPath,
    //   [
    //     "--token=a6196374-3614-4054-94f8-4d0503ee66f4",
    //     "--commit=1a2ad05cc6be3e4814309a3d662b61a242dd2088",
    //     "--slug=wexond/cloud",
    //     "--branch=updates-v2",
    //     "--disable=detect",
    //   ],
    //   { env: { CI: "true" } },
    // );

    // process.stdout.write(covRes.stdout);
  } catch (error) {
    process.stderr.write(error.stderr);
    process.stdout.write(error.stdout);
    process.exit(1);
  }

  process.exit(1);
};

main();
