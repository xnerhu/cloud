import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { rename } from "fs/promises";
import { join } from "path";
import { ClientProxy } from "@nestjs/microservices";
import { DiskStorageFile } from "@common/nest";
import {
  CreateReleaseDto,
  GetDiffInfoDto,
  GetDistributionDto,
  UploadPatchDto,
} from "@network/updates-api";
import { NewUpdateEvent, PATTERN_NEW_UPDATE } from "@network/updates-queue";

import { DistributionsService } from "../distributions/distributions-service";
import { PatchEntry, PatchesService } from "../patches/patches-service";
import { ReleaseEntity } from "../releases/release-entity";
import { ReleasesService } from "../releases/releases-service";
import { getUpdateDownloadInfo } from "../updates/updates-utils";
import { AdminCreateReleaseResponse } from "./admin-response";
import {
  formatUploadFilename,
  getUploadFilename,
  verifyUploadFile,
} from "./uploads-utils";
import { RMQ_PROXY_TOKEN } from "../rmq/rmq-proxy";
import { ConfigService } from "../config/config-service";

@Injectable()
export class AdminService {
  constructor(
    private readonly distributionsService: DistributionsService,
    private readonly patchesService: PatchesService,
    private readonly releasesService: ReleasesService,
    private readonly configService: ConfigService,
    @Inject(RMQ_PROXY_TOKEN) private readonly rmq: ClientProxy,
  ) {}

  public async getDistribution(data: GetDistributionDto) {
    const distro = await this.distributionsService.findOneOrFail(data);

    return { distributionId: distro.id };
  }

  public async createRelease({
    channel,
    notes,
    version,
  }: CreateReleaseDto): Promise<AdminCreateReleaseResponse> {
    let release: ReleaseEntity | null = await this.releasesService.findOne({
      channel,
      version,
    });

    const created = !release;

    if (!release) {
      release = await this.releasesService.createOne({
        channel,
        version,
        notes,
      });
    }

    return { releaseId: release.id, created };
  }

  public async getDiffInfo({
    channel,
    version,
    distributionId,
  }: GetDiffInfoDto) {
    await this.distributionsService.findOneOrFail({ id: distributionId });

    const publicPath = this.configService.updatesPublicPath;

    const entry = await this.patchesService.findOneBefore({
      distributionId,
      channel,
      version,
    });

    if (!entry) {
      throw new NotFoundException(`No previous release found`);
    }

    return getUpdateDownloadInfo(entry, false, publicPath!);
  }

  public async uploadPatch(
    { distributionId, releaseId, fullHash, hash }: UploadPatchDto,
    patch: DiskStorageFile,
    full: DiskStorageFile,
  ) {
    const [release, distribution] = await Promise.all([
      this.releasesService.findOneOrFail({ id: releaseId }),
      this.distributionsService.findOneOrFail({ id: distributionId }),
    ]);

    if (await this.patchesService.findOne({ releaseId, distributionId })) {
      throw new BadRequestException(
        `Patch for distribution ${distribution.os}-` +
          `${distribution.architecture}-${distribution.osVersion} already exists`,
      );
    }

    await Promise.all([
      verifyUploadFile(patch.path, hash, true),
      verifyUploadFile(full.path, fullHash, false),
    ]);

    const baseFilename = getUploadFilename(release, distribution);

    const patchFilename = formatUploadFilename(baseFilename, patch.path);
    const patchPath = join(this.configService.updatesPath, patchFilename);

    const fullFilename = formatUploadFilename(baseFilename, full.path);
    const fullPath = join(this.configService.updatesPath, fullFilename);

    await Promise.all([
      rename(patch.path, patchPath),
      rename(full.path, fullPath),
    ]);

    const patchEntity = await this.patchesService.createOne({
      distribution,
      release,
      filename: patchFilename,
      fullFilename,
      hash,
      fullHash,
      size: patch.size,
      fullSize: full.size,
    });

    const entry: PatchEntry = {
      ...patchEntity,
      notes: release.notes,
      version: release.version,
    };

    if (this.configService.isRMQEnabled) {
      this.rmq.emit(PATTERN_NEW_UPDATE, {
        release,
        distribution,
      } as NewUpdateEvent);
    }

    return {
      patch: getUpdateDownloadInfo(
        entry,
        false,
        this.configService.updatesPublicPath,
      ),
      full: getUpdateDownloadInfo(
        entry,
        true,
        this.configService.updatesPublicPath,
      ),
    };
  }
}
