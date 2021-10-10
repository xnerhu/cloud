import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

console.log(process.argv, JSON.stringify(readdirSync(resolve(__dirname))));

const xdd = readFileSync("bazel-out/volatile-status.txt", "utf8");

// console.log(xdd);

const args = process.argv;

const outs = args
  .filter((r) => r.startsWith("--output="))
  .map((r) => r.split("--output=")[1]);

// console.log(outs);

writeFileSync(outs[0], new Date().toTimeString());
