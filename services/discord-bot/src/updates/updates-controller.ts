import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
  PATTERN_RELEASE_ROLLOUT_EVENT,
  ReleaseRolloutEvent,
} from "@network/updates-queue";

import { UpdatesService } from "./updates-service";

@Controller()
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @MessagePattern(PATTERN_RELEASE_ROLLOUT_EVENT)
  public onReleaseRollout(@Payload() data: ReleaseRolloutEvent) {
    this.updatesService.onReleaseRollout(data);
  }
}
