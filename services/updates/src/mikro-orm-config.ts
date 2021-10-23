import { Options } from "@mikro-orm/core";

import { AssetEntity } from "./assets/asset-entity";
import { DistributionEntity } from "./distributions/distribution-entity";
import { ReleaseEntity } from "./releases/release-entity";

export const config: Options = {
  type: "postgresql",
  host: "localhost",
  port: 5432,
  dbName: "updates",
  user: "root",
  password: "example",
  entities: [ReleaseEntity, DistributionEntity, AssetEntity],
  debug: process.env.NODE_ENV === "development",
  forceUtcTimezone: true,
  strict: true,
  discovery: {
    requireEntitiesArray: true,
  },
};

export default config;
