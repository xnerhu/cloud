import { readFile } from 'fs/promises';
import { AppError, pathExists } from '@services/common';

import { PATH_RELEASES } from '../constants/paths';
import { ReleaseModel, UpdateModel } from '../interfaces';
import { CACHE_TIME, UPDATES_PUBLIC_PATH } from '../constants';

export class ReleaseStore {
  public list: ReleaseModel[] = [];

  private cacheTime: number;

  public async init() {
    await this.loadData();
  }

  protected async loadData() {
    if (!(await pathExists(PATH_RELEASES))) {
      throw new Error(`Releases file doesn't exists at ${PATH_RELEASES}!`);
    }

    const data = await readFile(PATH_RELEASES, 'utf8');

    this.list = JSON.parse(data);
    this.cacheTime = Date.now();
  }

  protected get isCacheExpired() {
    return (
      this.list.length === 0 ||
      (Date.now() - this.cacheTime) / 1000 / 60 > CACHE_TIME
    );
  }

  protected get latestVersion() {
    return this.list?.[0];
  }

  public async getForVersion(version: string): Promise<UpdateModel> {
    if (this.isCacheExpired) {
      await this.loadData();
    }

    const index = this.list.findIndex((r) => r.version === version);

    if (index === -1)
      throw new AppError(`Browser version ${version} is incorrect`);

    if (index === 0) return { type: 'none' };

    const patches = this.list.slice(0, index);
    const patchesSize = patches.reduce((sum, r) => sum + r.diffSize, 0);

    const full = patchesSize >= this.latestVersion.fullSize;
    const files = full
      ? [this.latestVersion.fullFile]
      : patches.map((r) => r.patchFile);

    return {
      type: full ? 'full' : 'patches',
      files: files.map((r) => `${UPDATES_PUBLIC_PATH}/${r}`),
    };
  }
}
