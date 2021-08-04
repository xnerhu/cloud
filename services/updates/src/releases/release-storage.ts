import { JSONStorage, ServiceLogger } from '@services/common';

import { IncorrectBrowserVersion } from '../api/errors';
import { CACHE_TIME, PATH_FILES_PUBLIC } from '../constants';
import { PATH_RELEASES_JSON } from '../constants/paths';
import { ReleaseModel, UpdateFileModel, UpdateModel } from '../interfaces';

const formatUpdateFile = (
  path: string,
  size: number,
  hash?: string,
): UpdateFileModel => {
  return {
    url: `${PATH_FILES_PUBLIC}/${path}`,
    filename: path,
    size,
    hash,
  };
};

export class ReleaseStorage extends JSONStorage {
  public list: ReleaseModel[] = [];

  constructor(logger: ServiceLogger) {
    super({ path: PATH_RELEASES_JSON, cacheTime: CACHE_TIME }, logger);
  }

  protected onLoad(data: any) {
    this.list = data;
  }

  protected canReload() {
    return this.list.length === 0 || this.hasCacheExpired;
  }

  public get latestVersion() {
    return this.list[0];
  }

  public exists(version: string) {
    return !!this.list.find((r) => r.version === version);
  }

  public async getUpdate(version?: string): Promise<UpdateModel> {
    await this.load();

    if (version == null) {
      return this.getFullUpdate();
    }

    const patches = this.getPatches(version);
    if (!patches) return { type: 'none' };

    const patchesSize = patches.reduce((sum, r) => sum + r.diffSize, 0);

    if (patchesSize >= this.latestVersion.fullSize!) {
      return this.getFullUpdate();
    }

    return {
      type: 'patches',
      fullFile: this.getFullFile(),
      patches: patches
        .map((r) => formatUpdateFile(r.patchFile, r.diffSize, r.patchHash))
        .reverse(),
    };
  }

  private getFullFile() {
    const { fullFile, fullSize, fullHash } = this.latestVersion;
    if (!fullFile || !fullSize) return;
    return formatUpdateFile(fullFile, fullSize, fullHash);
  }

  public getFullUpdate(): UpdateModel {
    if (
      this.latestVersion.fullSize == null ||
      this.latestVersion.fullFile == null
    ) {
      this.logger.warn('No release available');
      return { type: 'none' };
    }

    return { type: 'full', fullFile: this.getFullFile() };
  }

  public getPatches(version: string) {
    const index = this.list.findIndex((r) => r.version === version);

    if (index === -1) throw IncorrectBrowserVersion(version);
    if (index === 0) return null;

    return this.list.slice(0, index);
  }

  public save() {
    return super.save(this.list);
  }
}
