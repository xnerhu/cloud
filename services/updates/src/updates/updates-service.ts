import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  DEFAULT_DISTRIBUTION_SEARCH_OPTIONS,
  DistributionsService,
} from "../distributions/distributions-service";
import { PatchesService } from "../patches/patches-service";
import { GetUpdatesDto } from "./updates-dto";
import { UpdateResponse, UpdateV1Response } from "./updates-response";
import { getUpdateEntryFetchInfo, getUpdateStrategy } from "./updates-utils";
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
    const distribution = await this.distributionsService.findOne({
      ...DEFAULT_DISTRIBUTION_SEARCH_OPTIONS,
      ..._distribution,
    });

    if (!distribution) {
      throw new NotFoundException("Distribution not found");
    }

    const { id: distributionId } = distribution;

    const [latest, ...patches] = await this.patchesService.find({
      version,
      channel,
      distributionId,
    });

    const strategy = getUpdateStrategy(latest, patches);

    if (strategy === "none") {
      return { strategy };
    }

    const publicPath = this.configService.get<string>(
      "UPDATES_FILES_PUBLIC_PATH",
    );

    const res: UpdateResponse = {
      strategy,
      full: getUpdateEntryFetchInfo(latest, false, publicPath),
    };

    if (strategy === "full") {
      return res;
    }

    return {
      ...res,
      patches: patches.map((patch) =>
        getUpdateEntryFetchInfo(patch, true, publicPath),
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
