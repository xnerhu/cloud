import { ServiceLogger } from '@backend/common';

import { PATH_RELEASES_PUBLIC } from '../constants';
import { DistributionQuery } from './distribution-entity';
import { INCORRECT_DISTRIBUTION } from './errors';
import { ReleaseController } from './release-controller';
import { ReleaseEntity } from './release-entity';

export interface UpdateItem {
  hash: string;
  filename: string;
  url: string;
}

export interface UpdateStrategy {
  type: 'none' | 'full' | 'patches';
  items: UpdateItem[];
}

const formatRelease = (release: ReleaseEntity, full = false): UpdateItem => {
  const format = full ? 'packed.7z' : '7z';

  return {
    hash: full ? release.hash : release.patchHash,
    filename: `${release.tag}.${format}`,
    url: `${PATH_RELEASES_PUBLIC}/${release.tag}.${format}`,
  };
};

export class UpdateController {
  constructor(
    private readonly releaseController: ReleaseController,
    private readonly logger: ServiceLogger,
  ) {}

  public async get(
    tag: string,
    { architecture, osVersion, platform }: DistributionQuery,
  ): Promise<UpdateStrategy> {
    const distribution = await this.releaseController.getDistributionId({
      architecture,
      osVersion,
      platform,
    });

    if (!distribution) throw INCORRECT_DISTRIBUTION();

    const releases = await this.releaseController.get(tag, distribution);

    if (releases.length === 0) {
      return { type: 'none', items: [] };
    }

    const latest = releases[0];
    const patchesSize = releases.reduce((sum, r) => sum + r.patchSize, 0);

    // If overall size of patches is larger than size of full release,
    // we want browser to download full release
    if (patchesSize >= latest.size) {
      return { type: 'full', items: [formatRelease(latest, true)] };
    }

    return {
      type: 'patches',
      items: releases.map((r) => formatRelease(r)).reverse(),
    };
  }
}
