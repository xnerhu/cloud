import { ClientProxy } from "@nestjs/microservices";
import { AssetType, ReleaseStatusType } from "@core/updates";
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
  AdminChangeStatusResponse,
  AdminCreateReleaseResponse,
  AdminGetDiffInfoResponse,
  AdminReleaseRolloutDto,
  AdminUploadAssetResponse,
  CreateReleaseDto,
  GetDiffInfoDto,
  UploadAssetDto,
} from "@network/updates-api";
import { NewUpdateEvent, PATTERN_NEW_UPDATE } from "@network/updates-queue";

import { AssetsService } from "../../assets/assets-service";
import { ReleaseEntity } from "../../releases/release-entity";
import { ConfigService } from "../../config/config-service";
import { AssetEntity } from "../../assets/asset-entity";
import { DistributionEntity } from "../../distributions/distribution-entity";
import { RMQ_PROXY_TOKEN } from "../../messaging/rmq-proxy";
import { validateReleaseRollout } from "../../releases/release-utils";

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
      release = new ReleaseEntity({
        channel,
        version,
        notes: notes || "",
        status: ReleaseStatusType.SUSPENDED,
        assets: [],
      });

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

    return { asset: this.assetsService.format(asset) };
  }

  public async uploadAsset(
    { hash, version, channel, type, ..._distribution }: UploadAssetDto,
    file: DiskStorageFile,
  ): Promise<AdminUploadAssetResponse> {
    if (!AssetType[type]) {
      throw new BadRequestException(`Asset type ${type} doesn't exists`);
    }

    const release = await this.releasesRepo.findOne({ version, channel });

    if (!release) {
      throw new NotFoundException("Release not found");
    }

    if (release.status === ReleaseStatusType.ROLLED_OUT) {
      throw new BadRequestException(`Release is rolled out`);
    }

    const distribution = await this.distributionEntity.findOne(_distribution);

    if (!distribution) {
      throw new NotFoundException("Distribution not found");
    }

    const dbEntry = await this.assetsRepo.findOne({
      release: { id: release.id },
      distribution: { id: distribution.id },
      type,
    });

    if (dbEntry) {
      throw new BadRequestException(
        `Asset for this distribution already exists`,
      );
    }

    const asset = await this.assetsService.upload({
      release,
      distribution,
      hash,
      path: file.path,
      size: file.size,
      type,
    });

    return {
      asset: this.assetsService.format(asset),
    };
  }

  public async rolloutRelease({
    channel,
    version,
  }: AdminReleaseRolloutDto): Promise<AdminChangeStatusResponse> {
    const release = await this.releasesRepo.findOne({ version, channel });

    if (!release) {
      throw new NotFoundException("Release not found");
    }

    const assets = await this.assetsRepo.find({ release });

    const canRollout = validateReleaseRollout(assets);

    if (canRollout !== true) {
      throw new BadRequestException(`Cannot rollout release.`, canRollout);
    }

    if (release.status === ReleaseStatusType.ROLLED_OUT) {
      return { changed: false };
    }

    release.status = ReleaseStatusType.ROLLED_OUT;

    await this.releasesRepo.persistAndFlush(release);

    return { changed: true };
  }
}
