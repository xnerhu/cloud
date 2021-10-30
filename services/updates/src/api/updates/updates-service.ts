import { Distribution } from "@core/updates";
import { Injectable } from "@nestjs/common";
import { GetUpdatesDto, UpdateResponse } from "@network/updates-api";
import { omitNull } from "@common/utils";

import { getUpdateStrategy } from "./strategy";
import { AssetsService } from "../../assets/assets-service";

const DEFAULT_DISTRIBUTION: Partial<Distribution> = {
  os: "windows",
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
      packed: this.assetsService.formatRelease(packed),
    };

    if (strategy === "packed") {
      return res;
    }

    return {
      ...res,
      patches: patches.map((patch) => this.assetsService.formatRelease(patch)),
    };
  }
}
