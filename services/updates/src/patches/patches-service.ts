import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { omitNull } from "@common/utils";
import { Patch } from "@core/updates";

import { PatchEntity } from "./patch-entity";
import { DistributionEntity } from "../distributions/distribution-entity";
import { ReleaseEntity } from "../releases/release-entity";

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

export interface PatchSearchOptions {
  distributionId: number;
  version: string;
  channel: string;
}

export type PatchFindOneOptions = { distributionId?: number } & {
  releaseId?: number;
} & { version?: string; channel?: string };

export type PatchCreateOneOptions = Omit<
  Patch,
  "id" | "distribution" | "release" | "createdAt"
> & {
  distribution: DistributionEntity;
  release: ReleaseEntity;
};

@Injectable()
export class PatchesService {
  constructor(
    @InjectRepository(PatchEntity)
    private readonly patchesRepo: EntityRepository<PatchEntity>,
  ) {}

  private getFindQuery() {
    return this.patchesRepo
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
      .leftJoin("patches.release", "releases");
  }

  /**
   * Returns latest patches
   */
  public async find({
    version,
    distributionId,
    channel,
  }: PatchSearchOptions): Promise<PatchEntry[]> {
    return await this.getFindQuery()
      .where({
        distribution: distributionId,
        release: { channel, version: { $gt: version } },
      })
      .orderBy({ "releases.version": "DESC" })
      .execute<PatchEntry[]>("all");
  }

  public async findOne({
    distributionId,
    releaseId,
    channel,
    version,
  }: PatchFindOneOptions) {
    return await this.patchesRepo.findOne({
      release: omitNull({ id: releaseId, channel, version }),
      distribution: { id: distributionId },
    });
  }

  /**
   * Returns the patch before a certain release
   */
  public async findOneBefore({
    distributionId,
    channel,
    version,
  }: PatchSearchOptions): Promise<PatchEntry> {
    return await this.getFindQuery()
      .where({
        distribution: distributionId,
        release: { channel, version: { $lt: version } },
      })
      .limit(1)
      .orderBy({ "releases.version": "DESC" })
      .execute<PatchEntry>("get");
  }

  public async createOne({
    distribution,
    filename,
    fullFilename,
    fullHash,
    fullSize,
    hash,
    release,
    size,
  }: PatchCreateOneOptions) {
    const patchEntity = new PatchEntity();

    patchEntity.filename = filename;
    patchEntity.hash = hash;
    patchEntity.size = size;
    patchEntity.fullFilename = fullFilename;
    patchEntity.fullHash = fullHash;
    patchEntity.fullSize = fullSize;
    patchEntity.distribution = distribution;
    patchEntity.release = release;

    await this.patchesRepo.persistAndFlush(patchEntity);

    return patchEntity;
  }
}
