import { ClientProxy } from "@nestjs/microservices";
import { AssetType } from "@core/updates";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DiskStorageFile } from "@common/nest";
import {
  AdminCreateReleaseResponse,
  AdminGetDiffInfoResponse,
  AdminUploadPatchResponse,
  CreateReleaseDto,
  GetDiffInfoDto,
  UploadInstallerAssetDto,
  UploadPatchAssetsDto,
} from "@network/updates-api";
import { NewUpdateEvent, PATTERN_NEW_UPDATE } from "@network/updates-queue";

import { AssetsService } from "../../assets/assets-service";
import { ReleaseEntity } from "../../releases/release-entity";
import { ConfigService } from "../../config/config-service";
import { AssetEntity } from "../../assets/asset-entity";
import { DistributionEntity } from "../../distributions/distribution-entity";
import { RMQ_PROXY_TOKEN } from "../../messaging/rmq-proxy";

export interface ReleaseSearchOptions {
  version: string;
  channel: string;
  distributionId: number;
}

@Injectable()
export class AdminService {
  constructor(
    private readonly configService: ConfigService,
    private readonly assetsService: AssetsService,
    @InjectRepository(AssetEntity)
    private readonly assetsRepo: EntityRepository<AssetEntity>,
    @InjectRepository(ReleaseEntity)
    private readonly releasesRepo: EntityRepository<ReleaseEntity>,
    @InjectRepository(DistributionEntity)
    private readonly distributionEntity: EntityRepository<DistributionEntity>,
    @Inject(RMQ_PROXY_TOKEN) private readonly rmq: ClientProxy,
  ) {}

  public async createRelease({
    channel,
    notes,
    version,
  }: CreateReleaseDto): Promise<AdminCreateReleaseResponse> {
    let release = await this.releasesRepo.findOne({ channel, version });

    const created = !release;

    if (!release) {
      release = new ReleaseEntity();

      release.channel = channel;
      release.version = version;
      release.notes = notes || "";

      await this.releasesRepo.persistAndFlush(release);
    }

    return { releaseId: release.id, created };
  }

  /**
   * Returns info used for making a patch between two versions
   */
  public async getDiffInfo({
    channel,
    version,
    ...distribution
  }: GetDiffInfoDto): Promise<AdminGetDiffInfoResponse> {
    const asset = await this.assetsService.getLatestPacked({
      channel,
      distribution,
    });

    if (!asset) {
      throw new NotFoundException(`No previous release found`);
    }

    return this.assetsService.format(asset);
  }

  public async uploadPatchAndPacked(
    {
      packedHash,
      patchHash,
      version,
      channel,
      ..._distribution
    }: UploadPatchAssetsDto,
    patch: DiskStorageFile,
    packed: DiskStorageFile,
  ): Promise<AdminUploadPatchResponse> {
    const release = await this.releasesRepo.findOne({ version, channel });

    if (!release) {
      throw new NotFoundException("Release not found");
    }

    const distribution = await this.distributionEntity.findOne(_distribution);

    if (!distribution) {
      throw new NotFoundException("Distribution not found");
    }

    const patchDB = await this.assetsRepo.findOne({
      release: { id: release.id },
      distribution: { id: distribution.id },
      type: { $or: [AssetType.PATCH, AssetType.PATCH] },
    });

    if (patchDB) {
      throw new BadRequestException(
        `Patch for distribution ${distribution.os}-` +
          `${distribution.architecture}-${distribution.osVersion} already exists`,
      );
    }

    const [patchAsset, packedAsset] = await Promise.all([
      this.assetsService.upload({
        release,
        distribution,
        hash: patchHash,
        path: patch.path,
        size: patch.size,
        type: AssetType.PATCH,
      }),
      this.assetsService.upload({
        release,
        distribution,
        hash: packedHash,
        path: packed.path,
        size: packed.size,
        type: AssetType.PACKED,
      }),
    ]);

    await this.assetsRepo.flush();

    const releaseData = { version, notes: release.notes };

    if (this.configService.isRMQEnabled) {
      this.rmq.emit(PATTERN_NEW_UPDATE, {
        release: {
          id: release.id,
          notes: release.notes,
          channel,
          version,
        },
        distribution: {
          id: distribution.id,
          ..._distribution,
        },
      } as NewUpdateEvent);
    }

    return {
      patch: this.assetsService.format({ ...releaseData, ...patchAsset }),
      packed: this.assetsService.format({ ...releaseData, ...packedAsset }),
    };
  }

  public async uploadInstaller(
    {
      installerHash,
      version,
      channel,
      ..._distribution
    }: UploadInstallerAssetDto,
    installerFile: DiskStorageFile,
  ) {
    const release = await this.releasesRepo.findOne({ version, channel });

    if (!release) {
      throw new NotFoundException("Release not found");
    }

    const distribution = await this.distributionEntity.findOne(_distribution);

    if (!distribution) {
      throw new NotFoundException("Distribution not found");
    }

    const installerDB = await this.assetsRepo.findOne({
      release: { id: release.id },
      distribution: { id: distribution.id },
      type: AssetType.INSTALLER,
    });

    if (installerDB) {
      throw new BadRequestException(
        `Installer for distribution ${distribution.os}-` +
          `${distribution.architecture}-${distribution.osVersion} already exists`,
      );
    }

    await this.assetsService.upload({
      release,
      distribution,
      hash: installerHash,
      path: installerFile.path,
      size: installerFile.size,
      type: AssetType.INSTALLER,
    });

    await this.assetsRepo.flush();
  }
}
