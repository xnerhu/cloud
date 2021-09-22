import { Options } from '@mikro-orm/core';
import { resolve } from 'path';
import {
  ReleaseEntity,
  DistributionEntity,
  PatchEntity,
} from '@common/updates-db';

const config: Options = {
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  dbName: 'updates',
  user: 'root',
  password: 'example',
  entities: [ReleaseEntity, DistributionEntity, PatchEntity],
  baseDir: resolve(__dirname, '../'),
  debug: true,
  discovery: {
    requireEntitiesArray: true,
  },
};

export default config;
