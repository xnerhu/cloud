import { Injectable } from "@nestjs/common";
import { ReleaseRolloutEvent } from "@network/updates-queue";

import { ConfigService } from "../config/config-service";
import { ClientService } from "../client/client-service";
import { updateMessageTemplate } from "./update-message-template";

@Injectable()
export class UpdatesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly clientService: ClientService,
  ) {}

  public async onReleaseRollout(e: ReleaseRolloutEvent) {
    const channel = this.clientService.getUpdatesChannel();

    const embed = updateMessageTemplate({
      ...e,
      url: this.configService.downloadUrl,
    });

    await channel.send({ embeds: [embed] });
  }
}
