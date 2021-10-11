import { readFileSync, statSync } from "fs";
import { resolve } from "path";
import execa from "execa";

const main = async () => {
  const packageName = process.argv[2];

  if (packageName == null) {
    process.stderr.write("No package name provided");
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

    if (status.CI === "true") {
      if (status["CODECOV_TOKEN"].length === 0) {
        process.stdout.write("No codecov token provided");
        process.exit(1);
      }

      const covRes = await execa(covPath, [
        `--token=${status["CODECOV_TOKEN"]}`,
        `--commit=${status["GITHUB_SHA"]}`,
        `--slug=${status["GITHUB_REPOSITORY"]}`,
        `--branch=${status["GITHUB_HEAD_REF"]}`,
        `--build=${status["GITHUB_RUN_ID"]}`,
        "--disable=detect,gcov",
      ]);

      process.stdout.write(covRes.stdout);
      process.stderr.write(covRes.stderr);
    }
  } catch (error) {
    process.stderr.write(error.stderr);
    process.stdout.write(error.stdout);
    process.exit(1);
  }
};

main();
