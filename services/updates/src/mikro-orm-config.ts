import { Options } from "@mikro-orm/core";

import { AssetEntity } from "./assets/asset-entity";
import { getPostgresConfig } from "./config/env";
import { DistributionEntity } from "./distributions/distribution-entity";
import { ReleaseEntity } from "./releases/release-entity";

const { host, port, dbName, user, password } = getPostgresConfig();

export const config: Options = {
  type: "postgresql",
  host,
  port,
  dbName,
  user,
  password,
  entities: [ReleaseEntity, DistributionEntity, AssetEntity],
  debug: process.env.NODE_ENV === "development",
  forceUtcTimezone: true,
  strict: true,
  discovery: {
    requireEntitiesArray: true,
  },
};

export default config;
