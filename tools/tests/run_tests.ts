import { readFileSync } from "fs";
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
    const testChild = execa(testPath, [], {
      env: {
        __TESTS_TMP_PATH__: resolve(
          process.env.TEST_UNDECLARED_OUTPUTS_DIR as string,
          `.${packageName}-${Date.now()}`,
        ),
      },
    });

    testChild.stderr?.pipe(process.stdout);
    testChild.stdout?.pipe(process.stdout);

    await testChild;

    if (status.CI === "true") {
      if (status["CODECOV_TOKEN"].length === 0) {
        process.stdout.write("No codecov token provided");
        process.exit(1);
      }

      const isPR = status["GITHUB_EVENT_NAME"] === "pull_request";

      const branch = status["GITHUB_HEAD_REF"];
      const sha = isPR ? status["GITHUB_PR_SHA"] : status["GITHUB_SHA"];
      const pr = isPR ? status["GITHUB_REF"].split("/")[2] : "";

      const covChild = execa(covPath, [
        `--token=${status["CODECOV_TOKEN"]}`,
        `--commit=${sha}`,
        `--slug=${status["GITHUB_REPOSITORY"]}`,
        `--branch=${branch}`,
        `--build=${status["GITHUB_RUN_ID"]}`,
        ...(isPR ? [`--pr=${pr}`] : []),
        "--disable=detect,gcov",
      ]);

      covChild.stderr?.pipe(process.stdout);
      covChild.stdout?.pipe(process.stdout);

      await covChild;
    }
  } catch (error) {
    process.stderr.write(error.stderr);
    process.stdout.write(error.stdout);
    process.exit(1);
  }
};

main();
