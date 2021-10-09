import execa from "execa";
import { resolve } from "path";
import { isCI } from "ci-info";
import { readFile } from "fs/promises";

const parseGitStatus = (data: string) => {
  const lines = data.split("\n");
  const map = new Map<string, string>();

  lines.forEach((line) => {
    const [key, value] = line.split(" ");
    map.set(key, value);
  });

  return map;
};

const getCodeCovParams = (info: Map<string, string>) => {
  return {
    isCI: info.get("CI") || process.env.CI === "true",
    branch:
      info.get("GITHUB_HEAD_REF") ||
      process.env.GITHUB_HEAD_REF ||
      process.env.GITHUB_REF?.replace("refs/heads/", ""),
    build: info.get("GITHUB_RUN_ID") || process.env.GITHUB_RUN_ID,
    commit: info.get("GITHUB_SHA") || process.env.GITHUB_SHA,
    slug: info.get("GITHUB_REPOSITORY") || process.env.GITHUB_REPOSITORY,
    codeCovToken: info.get("CODECOV_TOKEN") || process.env.CODECOV_TOKEN,
  };
};

const main = async () => {
  const packageName = process.argv[2];

  if (packageName == null) {
    throw new Error("No package name provided");
  }

  const workingDir = resolve(__dirname, "../", packageName);

  const statusPath = resolve(workingDir, "git-status.txt");
  const testPath = resolve(workingDir, "test_jest.sh");
  const covPath = resolve(workingDir, "test_codecov.sh");

  const gitStatus = await readFile(statusPath, "utf8");
  const gitInfo = parseGitStatus(gitStatus);

  const params = getCodeCovParams(gitInfo);

  process.stdout.write(JSON.stringify(params));

  return;

  // try {
  //   const res = await execa(testPath, []);

  //   process.stdout.write(res.stdout);
  //   process.stderr.write(res.stderr);

  //   // console.log("xdd");

  //   // process.stdout.write(
  //   //   "xdd" + __dirname + "         " + isCI + "xddd" + JSON.stringify(params),
  //   // );

  //   if (params.isCI) {
  //     const covRes = await execa(covPath, [
  //       `--token=${params.codeCovToken}`,
  //       `--commit=${params.commit}`,
  //       `--slug=${params.slug}`,
  //       `--branch=${params.branch}`,
  //       `--build=${params.build}`,
  //       "--disable=detect",
  //     ]);

  //     process.stdout.write(covRes.stdout);
  //     process.stderr.write(covRes.stderr);
  //   }
  // } catch (error) {
  //   process.stderr.write(error.stderr);
  //   process.stdout.write(error.stdout);
  //   process.exit(1);
  // }
};

main();
