import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DiskStorageFile } from "@common/nest";
import { rename } from "fs/promises";
import { join } from "path";

import { DistributionsService } from "../distributions/distributions-service";
import { PatchesService } from "../patches/patches-service";
import { ReleaseEntity } from "../releases/release-entity";
import { ReleasesService } from "../releases/releases-service";
import { getUpdateDownloadInfo } from "../updates/updates-utils";
import {
  CreateReleaseDto,
  GetDiffInfoDto,
  GetDistributionDto,
  UploadPatchDto,
} from "./admin-dto";
import { AdminCreateReleaseResponse } from "./admin-response";
import {
  formatUploadFilename,
  getUploadFilename,
  verifyUploadFile,
} from "./uploads-utils";

@Injectable()
export class AdminService {
  constructor(
    private readonly distributionsService: DistributionsService,
    private readonly patchesService: PatchesService,
    private readonly releasesService: ReleasesService,
    private readonly configService: ConfigService,
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

    if (!release) {
      release = await this.releasesService.createOne({
        channel,
        version,
        notes,
      });
    }

    return { releaseId: release.id };
  }

  public async getDiffInfo({
    channel,
    version,
    distributionId,
  }: GetDiffInfoDto) {
    await this.distributionsService.findOneOrFail({ id: distributionId });

    const publicPath = this.configService.get<string>("UPDATES_PUBLIC_PATH");

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
      verifyUploadFile(patch.path, hash),
      verifyUploadFile(full.path, fullHash),
    ]);

    const storagePath = this.configService.get<string>("UPDATES_PATH");

    const baseFilename = getUploadFilename(release, distribution);

    const patchFilename = formatUploadFilename(baseFilename, patch.path);
    const patchPath = join(storagePath!, patchFilename);

    const fullFilename = formatUploadFilename(baseFilename, full.path);
    const fullPath = join(storagePath!, fullFilename);

    await Promise.all([
      rename(patch.path, patchPath),
      rename(full.path, fullPath),
    ]);

    await this.patchesService.createOne({
      distribution,
      release,
      filename: patchFilename,
      fullFilename,
      hash,
      fullHash,
      size: patch.size,
      fullSize: full.size,
    });
  }
}
