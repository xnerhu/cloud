import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { omitNull } from '@common/utils';
import { Distribution } from '../interfaces';
import { DistributionEntity } from '../distributions/distribution-entity';

export type DistributionSearchOptions = Record<
  keyof Omit<Distribution, 'id' | 'patches'>,
  string
>;

export const DEFAULT_DISTRIBUTION_SEARCH_OPTIONS: DistributionSearchOptions = {
  os: 'windows',
  osVersion: 'any',
  architecture: 'x64',
};

@Injectable()
export class DistributionsService {
  constructor(
    @InjectRepository(DistributionEntity)
    private readonly distributionsRepo: EntityRepository<DistributionEntity>,
  ) {}

  public findOne({ os, architecture, osVersion }: DistributionSearchOptions) {
    return this.distributionsRepo.findOne(
      omitNull({ os, architecture, osVersion }),
    );
  }
}
