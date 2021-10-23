import { Distribution } from "@core/updates";
import { Injectable } from "@nestjs/common";
import {
  GetUpdatesDto,
  UpdateResponse,
  UpdateV1Response,
} from "@network/updates-api";
import { omitNull } from "@common/utils";

import { getUpdateStrategy } from "./strategy";
import { AssetsService } from "../../assets/assets-service";
import { transformUpdateResV1 } from "./updates-v1";

const DEFAULT_DISTRIBUTION: Partial<Distribution> = {
  os: "windows",
  osVersion: "any",
  architecture: "x64",
};

export interface ReleaseSearchOptions {
  version: string;
  channel: string;
  distributionId: number;
}

@Injectable()
export class UpdatesService {
  constructor(private readonly assetsService: AssetsService) {}

  /**
   * Returns data for the most efficient update strategy.
   */
  public async get({
    channel,
    version,
    ..._distribution
  }: GetUpdatesDto): Promise<UpdateResponse> {
    const distribution = omitNull({
      ...DEFAULT_DISTRIBUTION,
      ..._distribution,
    });

    const [packed, patches] = await Promise.all([
      this.assetsService.getLatestPacked({ channel, distribution }),
      this.assetsService.getPatches({ version, channel, distribution }),
    ]);

    if (!packed || patches.length === 0) {
      return { strategy: "none" };
    }

    const strategy = getUpdateStrategy(packed, patches);

    const res: UpdateResponse = {
      strategy,
      packed: this.assetsService.format(packed),
    };

    if (strategy === "packed") {
      return res;
    }

    return {
      ...res,
      patches: patches.map((patch) => this.assetsService.format(patch)),
    };
  }

  /**
   * Returns data for the most efficient update strategy.
   * Supports only windows x64
   */
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
