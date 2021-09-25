import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { PatchEntity } from './patch-entity';

export interface PatchEntry {
  hash: string;
  size: number;
  fullHash: string;
  fullSize: number;
  version: string;
  notes: string;
}

export interface FindPatchesOptions {
  version: string;
  distributionId: number;
  channel: string;
}

@Injectable()
export class PatchesService {
  constructor(
    @InjectRepository(PatchEntity)
    private readonly patchesRepo: EntityRepository<PatchEntity>,
  ) {}

  public async find({ version, distributionId, channel }: FindPatchesOptions) {
    const patches = await this.patchesRepo
      .createQueryBuilder('patches')
      .select([
        'patches.hash',
        'patches.size',
        'patches.fullHash',
        'patches.fullSize',
      ])
      .leftJoin('patches.release', 'releases')
      .addSelect(['releases.version', 'releases.notes'])
      .where({
        distribution: distributionId,
        release: { channel, version: { $gt: version } },
      })
      .execute<PatchEntry[]>('all');

    return patches;
  }
}
