import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  Distribution,
  DistributionEntity,
  PatchEntity,
  ReleaseEntity,
  ReleaseChannel,
  Patch,
} from '@common/updates-db';
import { omitNull } from '@common/utils';

import { GetPatchesDto } from './patches-dto';
import { UpdateResponse, UpdateV1Response } from './update-response';
import { getUpdateEntryFetchInfo, getUpdateStrategy } from './update-utils';
import { transformUpdateResV1 } from './updates-v1';

export type DistributionSearchOptions = Record<
  keyof Omit<Distribution, 'id' | 'patches'>,
  string
>;

export interface PatchesResult {
  distribution: Distribution;
  channel: ReleaseChannel;
  patches: Patch[];
}

const DEFAULT_DISTRIBUTION_SEARCH_OPTIONS: DistributionSearchOptions = {
  os: 'windows',
  osVersion: 'any',
  architecture: 'x64',
};

export interface PatchDatabaseEntry {
  hash: string;
  size: number;
  fullHash: string;
  fullSize: number;
  version: string;
  notes: string;
}

export interface ReleaseSearchOptions {
  version: string;
  channel: string;
  distributionId: number;
}

@Injectable()
export class PatchesService {
  constructor(
    @InjectRepository(DistributionEntity)
    private readonly distributionsRepo: EntityRepository<DistributionEntity>,
    @InjectRepository(ReleaseEntity)
    private readonly releasesRepo: EntityRepository<ReleaseEntity>,
    @InjectRepository(PatchEntity)
    private readonly patchesRepo: EntityRepository<PatchEntity>, // private readonly configService: ConfigService,
  ) {}

  private getDistribution({
    os,
    architecture,
    osVersion,
  }: DistributionSearchOptions) {
    return this.distributionsRepo.findOne(
      omitNull({ os, architecture, osVersion }),
    );
  }

  private async getPatches({
    version,
    channel,
    distributionId,
  }: ReleaseSearchOptions) {
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
      .execute<PatchDatabaseEntry[]>('all');

    return patches;
  }

  public async getUpdate({
    channel,
    version,
    ..._distribution
  }: GetPatchesDto): Promise<UpdateResponse> {
    const distribution = await this.getDistribution({
      ...DEFAULT_DISTRIBUTION_SEARCH_OPTIONS,
      ..._distribution,
    });

    if (!distribution) {
      throw new NotFoundException('Distribution not found');
    }

    const { id: distributionId } = distribution;

    const [latest, ...patches] = await this.getPatches({
      channel,
      version,
      distributionId,
    });

    const strategy = getUpdateStrategy(latest, patches);

    if (strategy === 'none') {
      return { strategy };
    }

    const res: UpdateResponse = {
      strategy,
      full: getUpdateEntryFetchInfo(latest, false),
    };

    if (strategy === 'full') {
      return res;
    }

    return {
      ...res,
      patches: patches.map((patch) => getUpdateEntryFetchInfo(patch, true)),
    };
  }

  public async getUpdatesV1(version: string): Promise<UpdateV1Response> {
    const update = await this.getUpdate({
      os: 'windows',
      architecture: 'x64',
      osVersion: 'any',
      channel: 'stable',
      version,
    });

    return transformUpdateResV1(update);
  }
}
