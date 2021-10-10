import { readFileSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";

const main = () => {
  const packageName = process.argv[2];

  if (packageName == null) {
    throw new Error("No package name provided");
  }

  const workingDir = resolve(__dirname, "../../", packageName);
  const testPath = resolve(workingDir, "test_jest.sh");
  const covPath = resolve(workingDir, "test_codecov.sh");

  const status = JSON.parse(
    readFileSync(resolve(workingDir, "stamp.json"), "utf8"),
  );

  console.log(status);

  // spawnSync(covPath, [
  //   `--token=${status.}`,
  //   `--commit=${params.commit}`,
  //   `--slug=${params.slug}`,
  //   `--branch=${params.branch}`,
  //   `--build=${params.build}`,
  //   "--disable=detect",
  // ];

  // process.stdout.write(JSON.stringify(dir));

  throw new Error("xdd");
  // process.exit(1);
};

main();
