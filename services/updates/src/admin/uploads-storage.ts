import { DiskStorage } from "@common/nest";

import { TEST_UPDATES_PATH } from "../config/env";

export const uploadsStorage = new DiskStorage({
  dest: TEST_UPDATES_PATH,
});
