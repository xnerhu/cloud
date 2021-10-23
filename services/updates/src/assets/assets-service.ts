import { Asset, AssetType, Release } from "@core/updates";
import { EntityRepository } from "@mikro-orm/knex";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { DistributionSearchOptions, UpdateEntry } from "@network/updates-api";

import { ConfigService } from "../config/config-service";
import { DistributionEntity } from "../distributions/distribution-entity";
import { ReleaseEntity } from "../releases/release-entity";
import { AssetEntity } from "./asset-entity";

export type FormatAssetOptions = Pick<Release, "notes" | "version"> &
  Pick<Asset, "filename" | "hash" | "size" | "type">;

export type AssetsDBEntry = Pick<Asset, "type" | "filename" | "hash" | "size"> &
  Pick<Release, "version" | "notes">;

export interface GetLatestPackedOptions {
  channel: string;
  distribution: DistributionSearchOptions;
}

export interface FindPatchOptions {
  channel: string;
  version: string;
  distribution: DistributionSearchOptions;
}

export type GetPatchesOptions = FindPatchOptions;

export type CreateAssetOptions = {
  release: ReleaseEntity;
  distribution: DistributionEntity;
} & Pick<Asset, "filename" | "hash" | "type" | "size">;

@Injectable()
export class AssetsService {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(AssetEntity)
    private readonly assetsRepo: EntityRepository<AssetEntity>,
  ) {}

  public getPatchUrl(filename: string) {
    return `${this.config.patchesPublicPath}/${filename}`;
  }

  public getPackedUrl(filename: string) {
    return `${this.config.patchesPublicPath}/${filename}`;
  }

  public getInstallerUrl(filename: string) {
    return `${this.config.installersPublicPath}/${filename}`;
  }

  /**
   * Returns assets fetch details.
   */
  public format({
    filename,
    hash,
    notes,
    size,
    type,
    version,
  }: FormatAssetOptions): UpdateEntry {
    const url =
      type === AssetType.PATCH
        ? this.getPatchUrl(filename)
        : this.getPackedUrl(filename);

    return {
      filename,
      hash,
      notes,
      size,
      version,
      url,
    };
  }

  private getAssetsQuery() {
    return this.assetsRepo
      .createQueryBuilder("assets")
      .select(["assets.type", "assets.filename", "assets.hash", "assets.size"])
      .leftJoin("assets.release", "releases")
      .addSelect(["releases.version", "releases.notes"])
      .orderBy({ id: "DESC" });
  }

  public getLatestPacked({ distribution, channel }: GetLatestPackedOptions) {
    return this.getAssetsQuery()
      .where({
        type: AssetType.PACKED,
        distribution,
        release: { channel },
      })
      .limit(1)
      .execute<AssetsDBEntry | undefined>("get");
  }

  public getPatches({ channel, distribution, version }: GetPatchesOptions) {
    return this.getAssetsQuery()
      .where({
        type: AssetType.PATCH,
        distribution: distribution,
        release: { channel, version: { $gt: version } },
      })
      .execute<AssetsDBEntry[]>("all");
  }

  public async createOne({
    filename,
    hash,
    release,
    distribution,
    type,
    size,
  }: CreateAssetOptions) {
    const entity = new AssetEntity();

    entity.distribution = distribution;
    entity.release = release;

    entity.filename = filename;
    entity.hash = hash;
    entity.type = type;
    entity.release = release;
    entity.size = size;

    return entity;
  }
}
