import { readFile, writeFile } from 'fs/promises';

import { createAppError } from '../errors';
import { ServiceLogger } from '../logger';
import { pathExists } from '../utils';

const FileNotFound = createAppError(
  {
    name: 'JSON_STORAGE_FILE_NOT_FOUND',
    description: `File %s not found`,
  },
  false,
);

export interface JSONStorageOptions {
  path: string;
  cacheTime: number;
}

export class JSONStorage {
  private cacheTime: number;

  private reloadingEnabled = true;

  constructor(
    public readonly opts: JSONStorageOptions,
    protected readonly logger: ServiceLogger,
  ) {}

  public get path() {
    return this.opts.path;
  }

  public get hasCacheExpired() {
    return (Date.now() - this.cacheTime) / 1000 / 60 > this.opts.cacheTime;
  }

  public resetCacheTime() {
    this.cacheTime = Date.now();
  }

  public async init() {
    await this.load();
  }

  protected canReload() {
    return this.hasCacheExpired;
  }

  protected async load() {
    if (!this.reloadingEnabled || !this.canReload()) {
      return;
    }

    if (!(await pathExists(this.path))) {
      throw FileNotFound(this.path);
    }

    const json = await readFile(this.path, 'utf8');
    const data = JSON.parse(json);

    this.onLoad(data);
  }

  protected onLoad(data: any) {}

  public async save(data: any) {
    this.setReloading(false);
    await writeFile(this.path, JSON.stringify(data), 'utf8');
    this.setReloading(true);
  }

  public setReloading(enabled: boolean) {
    this.reloadingEnabled = enabled;

    if (enabled) {
      this.resetCacheTime();
    }
  }
}
