import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { UpdatesService } from "./updates-service";

@Controller()
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @MessagePattern("patches")
  public getPatches(@Payload() data: string) {
    this.updatesService.sendDiscordMessage(data);
  }
}
