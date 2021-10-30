import { Injectable } from "@nestjs/common";
import { UpdateV1Response } from "@network/updates-api";

import { transformUpdateResV1 } from "./updates-v1";
import { UpdatesService } from "./updates-service";

@Injectable()
export class UpdatesV1Service {
  constructor(private readonly updatesService: UpdatesService) {}

  /**
   * Returns data for the most efficient update strategy.
   * Supports only windows x64
   */
  public async get(version: string): Promise<UpdateV1Response> {
    const update = await this.updatesService.get({
      os: "windows",
      architecture: "x64",
      channel: "alpha",
      version,
    });

    return transformUpdateResV1(update);
  }
}
