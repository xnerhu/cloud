import { Injectable, NotFoundException } from "@nestjs/common";

import { DistributionsService } from "../distributions/distributions-service";
import { PatchesService } from "../patches/patches-service";
import { ReleaseEntity } from "../releases/release-entity";
import { ReleasesService } from "../releases/releases-service";
import { CreateReleaseDto, GetDiffInfoDto } from "./admin-dto";
import { AdminCreateReleaseResponse } from "./admin-response";

@Injectable()
export class AdminService {
  constructor(
    private readonly distributionsService: DistributionsService,
    private readonly patchesService: PatchesService,
    private readonly releasesService: ReleasesService,
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

    const release = await this.releasesService.findOneBefore({
      channel,
      version,
    });

    if (!release) {
      throw new NotFoundException(`Can't find release before ${version}`);
    }

    const patch = await this.patchesService.getDiffInfo({
      distributionId,
      channel,
      version,
    });

    return { patch, release };
  }
}
