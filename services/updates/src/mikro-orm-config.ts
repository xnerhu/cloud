import { Options } from '@mikro-orm/core';
import {
  ReleaseEntity,
  DistributionEntity,
  PatchEntity,
} from '@common/updates-db';

export const config: Options = {
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  dbName: 'updates',
  user: 'root',
  password: 'example',
  entities: [ReleaseEntity, DistributionEntity, PatchEntity],
  debug: true,
  discovery: {
    requireEntitiesArray: true,
  },
};

export default config;
