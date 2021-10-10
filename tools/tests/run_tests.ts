import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const packageName = process.argv[2];

  if (packageName == null) {
    throw new Error("No package name provided");
  }

  const workingDir = resolve(__dirname, "../../", packageName);

  const dir = JSON.parse(
    readFileSync(resolve(workingDir, "stamp.json"), "utf8"),
  );

  process.stdout.write(JSON.stringify(dir));

  throw new Error("xdd");
  // process.exit(1);
};

main();
