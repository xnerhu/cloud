import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PATTERN_NEW_UPDATE, NewUpdateEvent } from "@network/updates-queue";

import { UpdatesService } from "./updates-service";

@Controller()
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @MessagePattern(PATTERN_NEW_UPDATE)
  public getPatches(@Payload() data: NewUpdateEvent) {
    this.updatesService.sendDiscordMessage(data);
  }
}
