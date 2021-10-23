import { resolve } from "path";

import { IS_TEST } from "./env";

/**
 * Modifies path for test environments
 */
export const normalizePath = (path: string) => {
  if (IS_TEST) {
    return resolve(process.env.__TESTS_TMP_PATH__ as string, path);
  }
  return path;
};
