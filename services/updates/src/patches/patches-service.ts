import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";

import { PatchEntity } from "./patch-entity";
import { ReleaseSearchOptions } from "../releases/releases-service";
import { WriteStream } from "fs";

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

export interface PatchSearchOptions extends ReleaseSearchOptions {
  distributionId: number;
}

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

  /**
   * Creates a new patch
   */
  public async create(patchStream: WriteStream, fullStream: WriteStream) {}
}
