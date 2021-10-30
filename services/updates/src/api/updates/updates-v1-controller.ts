import { Controller, Get, Query } from "@nestjs/common";
import { GetUpdatesV1Dto } from "@network/updates-api";

import { UpdatesV1Service } from "./updates-v1-service";

@Controller("v1")
export class UpdatesV1Controller {
  constructor(private readonly updatesV1Service: UpdatesV1Service) {}

  /**
   * Backwards compatibility with Wexond <= 6.0.5.2
   */
  @Get("*")
  public getUpdatesV1(@Query() data: GetUpdatesV1Dto) {
    return this.updatesV1Service.get(data.browserVersion);
  }
}
