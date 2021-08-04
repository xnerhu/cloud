import { writeFile, unlink } from 'fs/promises';
import { resolve } from 'path';
import fileHash from 'md5-file';
import { createAppError, pathExists, ServiceLogger } from '@services/common';

import { PATH_FILES } from '../constants';
import { ReleaseStorage } from './release-storage';

export interface ReleaseInsertModel {
  patch: Buffer;
  full: Buffer;
  version: string;
  patchHash: string;
  fullHash: string;
}

export const ReleaseExists = createAppError({
  name: 'RELEASE_EXISTS',
  description: `Version %s already exists`,
  code: 400,
  log: true,
});

export const IncorrectPatchHash = createAppError({
  name: 'INCORRECT_PATCH_HASH',
  description: `Patch hash is incorrect. Received: %s, Got: %s`,
  code: 400,
  log: true,
});

export const IncorrectFullHash = createAppError({
  name: 'INCORRECT_FULL_HASH',
  description: `Full release hash is incorrect. Received: %s, Got: %s`,
  code: 400,
  log: true,
});

export class ReleaseController {
  constructor(
    private readonly storage: ReleaseStorage,
    private readonly logger: ServiceLogger,
  ) {}

  public async insert({
    patch,
    full,
    version,
    fullHash,
    patchHash,
  }: ReleaseInsertModel) {
    if (this.storage.exists(version)) {
      throw ReleaseExists(version);
    }

    const patchFilename = `${version}.patch`;
    const fullFilename = `${version}.packed.7z`;

    const patchPath = resolve(PATH_FILES, patchFilename);
    const fullPath = resolve(PATH_FILES, fullFilename);

    await Promise.all([writeFile(patchPath, patch), writeFile(fullPath, full)]);

    const [_patchHash, _fullHash] = await Promise.all([
      fileHash(patchPath),
      fileHash(fullPath),
    ]);

    if (_patchHash !== patchHash) {
      throw IncorrectPatchHash(_patchHash, patchHash);
    }

    if (_fullHash !== fullHash) {
      throw IncorrectFullHash(_fullHash, fullHash);
    }

    await this.removeOldRelease();

    this.storage.list.unshift({
      patchFile: patchFilename,
      fullFile: fullFilename,
      version,
      fullSize: full.byteLength,
      diffSize: patch.byteLength,
      fullHash: fullHash,
      patchHash: patchHash,
    });

    await this.storage.save();

    this.logger.info(
      `Successfully added a new release ${version}. MD5 Patch: ${patchHash}, MD5 Full: ${fullHash}`,
    );
  }

  private async removeOldRelease() {
    const oldFull = this.storage.list[1];

    if (!oldFull?.fullFile) {
      this.logger.warn('No old full release found');
      return;
    }

    const path = resolve(PATH_FILES, oldFull.fullFile);

    if (await pathExists(path)) {
      this.logger.info(`Removing old full release at ${path}`);
      await unlink(path);
    }

    delete oldFull.fullFile;
    delete oldFull.fullSize;
    delete oldFull.fullHash;
  }
}
