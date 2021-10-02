import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DistributionsService } from "../distributions/distributions-service";
import { PatchesService } from "../patches/patches-service";
import { ReleaseEntity } from "../releases/release-entity";
import { ReleasesService } from "../releases/releases-service";
import { getUpdateDownloadInfo } from "../updates/updates-utils";
import { CreateReleaseDto, GetDiffInfoDto } from "./admin-dto";
import { AdminCreateReleaseResponse } from "./admin-response";

@Injectable()
export class AdminService {
  constructor(
    private readonly distributionsService: DistributionsService,
    private readonly patchesService: PatchesService,
    private readonly releasesService: ReleasesService,
    private readonly configService: ConfigService,
  ) {}

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

  public async getDiffInfo({ channel, version, ..._distro }: GetDiffInfoDto) {
    const distro = await this.distributionsService.findOne(_distro);

    if (!distro) {
      throw new NotFoundException("Distribution not found");
    }

    const { id: distributionId } = distro;

    const publicPath = this.configService.get<string>("UPDATES_PUBLIC_PATH");

    const entry = await this.patchesService.findOneBefore({
      distributionId,
      channel,
      version,
    });

    return getUpdateDownloadInfo(entry, false, publicPath!);
  }
}
