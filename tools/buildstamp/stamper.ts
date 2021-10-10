import { readFileSync, writeFileSync } from "fs";

const TOKEN_OUTPUT = "--output=";
const TOKEN_STAMP = "--stamp=";

const getArgs = () => {
  const argv = process.argv;
  const stampFiles: string[] = [];
  let outputPath: string | undefined;

  for (const arg of argv) {
    if (arg.startsWith(TOKEN_OUTPUT)) {
      outputPath = arg.split(TOKEN_OUTPUT)[1];
    } else if (arg.startsWith(TOKEN_STAMP)) {
      const data = arg.split(TOKEN_STAMP)[1];

      stampFiles.push(data);
    }
  }

  return { stampFiles, outputPath };
};

const parseStatusFile = (data: string) => {
  const lines = data.split("\n");
  const obj: Record<string, string> = {};

  for (const line of lines) {
    const [key, value] = line.split(" ");

    if (key != null && value != null) {
      obj[key] = value;
    }
  }

  return obj;
};

const args = getArgs();

if (args.outputPath == null) {
  throw new Error("No output path provided");
}

if (args.stampFiles.length === 0) {
  throw new Error("No stamp files provided");
}

const statusFiles = args.stampFiles.map((path) => readFileSync(path, "utf8"));

const maps = statusFiles.map((r) => parseStatusFile(r));
const map = maps.reduce((obj, r) => ({ ...obj, ...r }), {});

writeFileSync(args.outputPath, JSON.stringify(map), "utf8");
