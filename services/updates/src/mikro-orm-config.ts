import { Options } from "@mikro-orm/core";

import { DistributionEntity } from "./distributions/distribution-entity";
import { PatchEntity } from "./patches/patch-entity";
import { ReleaseEntity } from "./releases/release-entity";

export const config: Options = {
  type: "postgresql",
  host: "localhost",
  port: 5432,
  dbName: "updates",
  user: "root",
  password: "example",
  entities: [ReleaseEntity, DistributionEntity, PatchEntity],
  debug: process.env.NODE_ENV === "development",
  forceUtcTimezone: true,
  strict: true,
  discovery: {
    requireEntitiesArray: true,
  },
};

export default config;
