import { resolve } from "path";
import { readdir, readFile } from "fs/promises";
import execa from "execa";

const getPackage = async (basePath = "") => {
  const data = await readFile(resolve(basePath, "package.json"), "utf8");
  return JSON.parse(data);
};
// test
const runBuild = async (path: string) => {
  try {
    await execa("yarn", ["build"], {
      cwd: path,
      stdout: process.stdout,
      stderr: process.stderr,
    });
  } catch (err) {
    process.stderr.write(Buffer.from(err.toString()));
    process.exit(1);
  }
};

const getAllPackages = async () => {
  const mainPackage = await getPackage();
  const { workspaces } = mainPackage;

  const paths: string[] = [];

  await Promise.all(
    workspaces.map(async (workspace: string) => {
      const path = workspace.split("/*")[0];
      const subdirs = await readdir(path);

      paths.push(...subdirs.map((r) => resolve(path, r)));
    }),
  );

  return paths;
};

export interface Package {
  name: string;
  deps: string[];
  path: string;
}

(async () => {
  const paths = await getAllPackages();

  const packages = await Promise.all(
    paths.map(async (path) => {
      const { name, dependencies, devDependencies } = await getPackage(path);

      return {
        name,
        deps: [...Object.keys(devDependencies), ...Object.keys(dependencies)],
        path,
      };
    }),
  );

  const packageNames = packages.map((r) => r.name);
  const packageList: Package[] = packages.map((_package) => {
    return {
      ..._package,
      deps: _package.deps.filter((name) => packageNames.includes(name)),
    };
  });

  const buildCache: string[] = [];

  const buildPackage = async (name: string, parentPackages: string[] = []) => {
    if (buildCache.includes(name)) return;

    if (parentPackages.includes(name)) {
      throw new Error(`Cyclic packages ${name}: ${parentPackages}`);
    }

    const _package = packageList.find((r) => r.name === name);

    if (!_package) {
      throw new Error(`No package ${name} found`);
    }

    const { path, deps } = _package;

    for (const dep of deps) {
      await buildPackage(dep, [...parentPackages, name]);
    }

    buildCache.push(name);

    console.log(`Building ${name}`);

    await runBuild(path);
  };

  for (const { name } of packageList) {
    await buildPackage(name);
  }
})();
