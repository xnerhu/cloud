import execa from "execa";
import { resolve } from "path";
import { isCI } from "ci-info";

const main = async () => {
  const testPath = resolve(__dirname, "test.sh");
  const covPath = resolve(__dirname, "codecov.sh");

  try {
    const res = await execa(testPath, []);

    const params = {
      branch:
        process.env.GITHUB_HEAD_REF ||
        process.env.GITHUB_REF?.replace("refs/heads/", ""),
      build: process.env.GITHUB_RUN_ID,
      commit: process.env.GITHUB_SHA,
      service: "github-actions",
      slug: process.env.GITHUB_REPOSITORY,
      pr: null,
    };

    if (process.env.GITHUB_HEAD_REF) {
      // PR refs are in the format: refs/pull/7/merge for pull_request events
      params["pr"] = process.env.GITHUB_REF?.split("/")[2];
    }

    process.stdout.write(res.stdout);

    process.stdout.write("XDDD" + isCI);

    // const covRes = await execa(
    //   covPath,
    //   [
    //     `--token=${process.env.CODECOV_TOKEN}`,
    //     `--commit=${params.commit}`,
    //     `--slug=${params.slug}`,
    //     `--branch=${params.slug}`,
    //     `--build=${params.build}`,
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
