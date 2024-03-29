import { join } from "path";
import {
  Asset,
  AssetType,
  Distribution,
  Release,
  ReleaseStatusType,
} from "@core/updates";
import { EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { DistributionSearchOptions } from "@network/updates-api";
import { makeId } from "@common/node";

import { ConfigService } from "../config/config-service";
import { DistributionEntity } from "../distributions/distribution-entity";
import { ReleaseEntity } from "../releases/release-entity";
import { AssetEntity } from "./asset-entity";
import { getAssetExtension, verifyAssetHash } from "./assets-utils";
import { copyFile } from "fs/promises";
import {
  AssetFetchInfo,
  ReleaseAssetFetchInfo,
} from "@network/updates-api/src/assets-response";

export type FormatAssetOptions = Pick<
  Asset,
  "filename" | "hash" | "size" | "type"
>;

export type FormatReleaseAssetOptions = FormatAssetOptions &
  Pick<Release, "version" | "notes">;

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

export type UploadAssetOptions = {
  path: string;
  release: ReleaseEntity;
  distribution: DistributionEntity;
} & Pick<Asset, "hash" | "size" | "type">;

export interface GetAssetDistributionsOptions {
  release?: ReleaseEntity;
}

export type AssetDistributionEntry = Pick<
  Distribution,
  "id" | "os" | "architecture"
>;

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

  public getUrl(type: AssetType, filename: string) {
    if (type === AssetType.PATCH) {
      return this.getPatchUrl(filename);
    } else if (type === AssetType.PACKED) {
      return this.getPatchUrl(filename);
    } else if (type === AssetType.INSTALLER) {
      return this.getInstallerUrl(filename);
    }

    throw new Error(`Can't format url for asset type ${type}`);
  }

  public getStoragePath(type: AssetType) {
    if (type === AssetType.INSTALLER) {
      return this.config.installersPath;
    }

    return this.config.patchesPath;
  }

  public format({
    filename,
    hash,
    size,
    type,
  }: FormatAssetOptions): AssetFetchInfo {
    return {
      filename,
      hash,
      size,
      url: this.getUrl(type, filename),
    };
  }

  public formatRelease({
    version,
    notes,
    ...opts
  }: FormatReleaseAssetOptions): ReleaseAssetFetchInfo {
    return { version, notes, ...this.format(opts) };
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
        release: { channel, status: ReleaseStatusType.ROLLED_OUT },
      })
      .limit(1)
      .execute<AssetsDBEntry | undefined>("get");
  }

  public getPatches({ channel, distribution, version }: GetPatchesOptions) {
    return this.getAssetsQuery()
      .where({
        type: AssetType.PATCH,
        distribution: distribution,
        release: {
          channel,
          version: { $gt: version },
          status: ReleaseStatusType.ROLLED_OUT,
        },
      })
      .orderBy({ id: "ASC" })
      .execute<AssetsDBEntry[]>("all");
  }

  /**
   * Verifies asset hash, copies it to its dedicaded storage path, then inserts it to the database
   */
  public async upload({
    type,
    path,
    hash,
    distribution,
    release,
    size,
  }: UploadAssetOptions) {
    await verifyAssetHash(path, hash);

    const filename = (await makeId(12)) + getAssetExtension(path, type);
    const storagePath = join(this.getStoragePath(type), filename);

    await copyFile(path, storagePath);

    const asset = new AssetEntity({
      filename,
      type,
      hash,
      distribution,
      size,
    });

    asset.release = release;

    this.assetsRepo.persistAndFlush(asset);

    return asset;
  }

  public async getDistributions({ release }: GetAssetDistributionsOptions) {
    let query = this.assetsRepo
      .createQueryBuilder("assets")
      .leftJoin("assets.distribution", "distributions")
      .select([
        "distributions.id",
        "distributions.os",
        "distributions.architecture",
      ])
      .groupBy("distributions.id");

    if (release) {
      query = query.where({ release: release });
    }

    return query.execute<AssetDistributionEntry[]>("all");
  }
}
