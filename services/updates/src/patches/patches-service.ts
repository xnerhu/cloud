import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";

import { PatchEntity } from "./patch-entity";

export interface PatchEntry {
  hash: string;
  filename: string;
  size: number;
  fullFilename: string;
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

export interface GetDiffTargetOptions {
  distributionId: number;
  version: string;
  channel: string;
}

export type DiffTarget = Pick<
  PatchEntry,
  "filename" | "hash" | "size" | "notes" | "version"
>;

@Injectable()
export class PatchesService {
  constructor(
    @InjectRepository(PatchEntity)
    private readonly patchesRepo: EntityRepository<PatchEntity>,
  ) {}

  public async find({ version, distributionId, channel }: FindPatchesOptions) {
    const patches = await this.patchesRepo
      .createQueryBuilder("patches")
      .select([
        "patches.filename",
        "patches.hash",
        "patches.size",
        "patches.fullFilename",
        "patches.fullHash",
        "patches.fullSize",
        "releases.version",
        "releases.notes",
      ])
      .leftJoin("patches.release", "releases")
      .where({
        distribution: distributionId,
        release: { channel, version: { $gt: version } },
      })
      .orderBy({ "releases.version": "DESC" })
      .execute<PatchEntry[]>("all");

    return patches;
  }

  public async getDiffTarget({
    distributionId,
    channel,
    version: _version,
  }: GetDiffTargetOptions): Promise<DiffTarget> {
    const {
      fullFilename: filename,
      fullHash: hash,
      fullSize: size,
      notes,
      version,
    } = await this.patchesRepo
      .createQueryBuilder("patches")
      .select([
        "patches.fullFilename",
        "patches.fullHash",
        "patches.fullSize",
        "releases.version",
        "releases.notes",
      ])
      .leftJoin("patches.release", "releases")
      .where({
        distribution: distributionId,
        release: { channel, version: { $lt: _version } },
      })
      .limit(1)
      .orderBy({ "releases.version": "DESC" })
      .execute<PatchEntry>("get");

    return { filename, hash, size, notes, version };
  }
}
