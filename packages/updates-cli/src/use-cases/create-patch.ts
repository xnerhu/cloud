import execa from "execa";

import { PATH_ZUCCHINI } from "../constants";
import { info, infoRes } from "../utils/logger";

export type CreatePatchOptions = {
  path: string;
  pathPrevious: string;
  out: string;
};

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

export const createPatch = async ({
  path,
  pathPrevious,
  out,
}: CreatePatchOptions) => {
  info(`Runing Zucchini ${path} - ${pathPrevious}`);

  await runZucchini(path, pathPrevious, out);

  infoRes(`Patch generated at ${out}`);

  return out;
};
