import { readFileSync } from "fs";
import { resolve } from "path";
import execa from "execa";

const main = async () => {
  const packageName = process.argv[2];

  if (packageName == null) {
    throw new Error("No package name provided");
    process.exit(1);
  }

  const workingDir = resolve(__dirname, "../../", packageName);
  const testPath = resolve(workingDir, "test_jest.sh");
  const covPath = resolve(workingDir, "test_codecov.sh");

  const status = JSON.parse(
    readFileSync(resolve(workingDir, "stamp.json"), "utf8"),
  );

  try {
    const res = await execa(testPath, []);

    process.stdout.write(res.stdout);
    process.stderr.write(res.stderr);

    // console.log("xdd");

    // process.stdout.write(
    //   "xdd" + __dirname + "         " + isCI + "xddd" + JSON.stringify(params),
    // );

    if (status.CI === "true") {
      throw "tset";
      // const covRes = await execa(covPath, [
      //   `--token=${params.codeCovToken}`,
      //   `--commit=${params.commit}`,
      //   `--slug=${params.slug}`,
      //   `--branch=${params.branch}`,
      //   `--build=${params.build}`,
      //   "--disable=detect",
      // ]);

      // process.stdout.write(covRes.stdout);
      // process.stderr.write(covRes.stderr);
    }
  } catch (error) {
    process.stderr.write(error.stderr);
    process.stdout.write(error.stdout);
    process.exit(1);
  }

  // console.log(status);

  // spawnSync(covPath, [
  //   `--token=${status.}`,
  //   `--commit=${params.commit}`,
  //   `--slug=${params.slug}`,
  //   `--branch=${params.branch}`,
  //   `--build=${params.build}`,
  //   "--disable=detect",
  // ];

  // process.stdout.write(JSON.stringify(dir));

  // throw new Error("xdd");
  // process.exit(1);
};

main();
