import { MongoEntityManager, ObjectID } from 'typeorm';
import { ServiceLogger } from '@backend/common';

import { ReleaseEntity } from './release-entity';
import { DistributionEntity, DistributionQuery } from './distribution-entity';

export class ReleaseController {
  constructor(
    private readonly manager: MongoEntityManager,
    private readonly logger: ServiceLogger,
  ) {}

  public async getDistributionId({
    platform,
    architecture,
    osVersion,
  }: DistributionQuery) {
    return await this.manager
      .findOne(DistributionEntity, {
        platform,
        architecture,
        osVersion,
      })
      .then((r) => r?.id);
  }

  public async get(tag: string, distribution: ObjectID) {
    const list = await this.manager.find(ReleaseEntity, {
      where: {
        distribution,
        tag: {
          $gt: tag,
        },
      },
    });

    return list;
  }
}
