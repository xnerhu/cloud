import { Controller, Get, Query } from "@nestjs/common";
import { GetUpdatesDto } from "@network/updates-api";

import { UpdatesService } from "./updates-service";

@Controller()
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @Get("updates")
  public getUpdates(@Query() data: GetUpdatesDto) {
    return this.updatesService.get(data);
  }
}
