import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";

import { PatchEntity } from "./patch-entity";

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

export interface PatchGetDiffInfoOptions {
  distributionId: number;
  version: string;
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
      .createQueryBuilder("patches")
      .select([
        "patches.hash",
        "patches.size",
        "patches.fullHash",
        "patches.fullSize",
      ])
      .leftJoin("patches.release", "releases")
      .addSelect(["releases.version", "releases.notes"])
      .where({
        distribution: distributionId,
        release: { channel, version: { $gt: version } },
      })
      .orderBy({ "releases.version": "DESC" })
      .execute<PatchEntry[]>("all");

    return patches;
  }

  public async getDiffInfo({
    distributionId,
    channel,
    version,
  }: PatchGetDiffInfoOptions) {
    const patch = await this.patchesRepo
      .createQueryBuilder("patches")
      .select([
        "patches.hash",
        "patches.size",
        "patches.fullHash",
        "patches.fullSize",
      ])
      .leftJoin("patches.release", "releases")
      .addSelect(["releases.version", "releases.notes"])
      .where({
        distribution: distributionId,
        release: { channel, version: { $lt: version } },
      })
      .limit(1)
      .orderBy({ "releases.version": "DESC" })
      .execute<PatchEntry>("get");

    return patch;
  }
}
