import { dirname, resolve } from "path";

export const PATH_ZUCCHINI = resolve(
  dirname(process.argv[1]),
  "../",
  "static/zucchini.exe",
);
