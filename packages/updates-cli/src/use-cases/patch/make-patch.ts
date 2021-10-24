import execa from "execa";
import { dirname } from "path";
import { ensureDir } from "@common/node";

import { info, success } from "../../utils";
import { PATH_ZUCCHINI } from "../../constants";

export interface MakePatchOptions {
  path: string;
  pathPrevious: string;
  out: string;
}

const runZucchini = async (
  newPath: string,
  previousPath: string,
  outPath: string,
) => {
  const patch = execa(PATH_ZUCCHINI, [`-gen`, previousPath, newPath, outPath]);

  patch.stderr?.pipe(process.stdout);
  patch.stdout?.pipe(process.stdout);

  await patch;
};

export const makePatch = async ({
  path,
  pathPrevious,
  out,
}: MakePatchOptions) => {
  info(`Runing Zucchini ${path} - ${pathPrevious}`);

  await ensureDir(dirname(path));

  await runZucchini(path, pathPrevious, out);

  success(`Patch generated at ${out}`);

  return out;
};
