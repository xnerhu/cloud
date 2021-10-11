import { Controller, Get, Query } from "@nestjs/common";

import { GetUpdatesDto, GetUpdatesV1Dto } from "./updates-dto";
import { UpdatesService } from "./updates-service";

@Controller()
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @Get("updates")
  public getUpdates(@Query() data: GetUpdatesDto) {
    return this.updatesService.get(data);
  }

  // Backwards compatibility with Wexond <= 6.0.5.2
  @Get("v1")
  public getUpdatesV1(@Query() data: GetUpdatesV1Dto) {
    return this.updatesService.getV1(data.browserVersion);
  }
}
