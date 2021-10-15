import { omitNull } from "@common/utils";
import { Injectable } from "@nestjs/common";
import { GetUpdatesDto } from "@network/updates-api";

import { ConfigService } from "../config/config-service";
import {
  DEFAULT_DISTRIBUTION_SEARCH_OPTIONS,
  DistributionsService,
} from "../distributions/distributions-service";
import { PatchesService } from "../patches/patches-service";
import { UpdateResponse, UpdateV1Response } from "./updates-response";
import { getUpdateDownloadInfo, getUpdateStrategy } from "./updates-utils";
import { transformUpdateResV1 } from "./updates-v1";

export interface ReleaseSearchOptions {
  version: string;
  channel: string;
  distributionId: number;
}

@Injectable()
export class UpdatesService {
  constructor(
    private readonly distributionsService: DistributionsService,
    private readonly patchesService: PatchesService,
    private readonly configService: ConfigService,
  ) {}

  public async get({
    channel,
    version,
    ..._distribution
  }: GetUpdatesDto): Promise<UpdateResponse> {
    const distribution = await this.distributionsService.findOneOrFail(
      omitNull({
        ...DEFAULT_DISTRIBUTION_SEARCH_OPTIONS,
        ..._distribution,
      }),
    );

    const { id: distributionId } = distribution;

    const releases = await this.patchesService.find({
      version,
      channel,
      distributionId,
    });

    const [latest, ...patches] = releases;

    const strategy = getUpdateStrategy(latest, patches);

    if (strategy === "none") {
      return { strategy };
    }

    const res: UpdateResponse = {
      strategy,
      full: getUpdateDownloadInfo(
        latest,
        false,
        this.configService.updatesPublicPath,
      ),
    };

    if (strategy === "full") {
      return res;
    }

    return {
      ...res,
      patches: releases.map((patch) =>
        getUpdateDownloadInfo(
          patch,
          true,
          this.configService.updatesPublicPath,
        ),
      ),
    };
  }

  public async getV1(version: string): Promise<UpdateV1Response> {
    const update = await this.get({
      os: "windows",
      architecture: "x64",
      osVersion: "any",
      channel: "stable",
      version,
    });

    return transformUpdateResV1(update);
  }
}
