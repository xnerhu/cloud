import execa from "execa";
import { resolve } from "path";
import { isCI } from "ci-info";

const main = async () => {
  const packageName = process.argv[2];

  if (packageName == null) {
    throw new Error("No package name provided");
  }

  const workingDir = resolve(__dirname, "../", packageName);

  const testPath = resolve(workingDir, "test_jest.sh");
  const covPath = resolve(workingDir, "test_codecov.sh");

  try {
    const res = await execa(testPath, []);

    process.stdout.write(res.stdout);
    process.stderr.write(res.stderr);

    process.stderr.write("test" + isCI + "   " + process.env.CI);
    process.exit(1);

    if (isCI) {
      const params = {
        branch:
          process.env.GITHUB_HEAD_REF ||
          process.env.GITHUB_REF?.replace("refs/heads/", ""),
        build: process.env.GITHUB_RUN_ID,
        commit: process.env.GITHUB_SHA,
        service: "github-actions",
        slug: process.env.GITHUB_REPOSITORY,
        pr: "",
      };

      if (process.env.GITHUB_HEAD_REF) {
        // PR refs are in the format: refs/pull/7/merge for pull_request events
        params["pr"] = process.env.GITHUB_REF?.split("/")[2] as any;
      }

      const covRes = await execa(covPath, [
        `--token=${process.env.CODECOV_TOKEN}`,
        `--commit=${params.commit}`,
        `--slug=${params.slug}`,
        `--branch=${params.branch}`,
        `--build=${params.build}`,
        "--disable=detect",
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
