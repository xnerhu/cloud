import { Inject, Injectable } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import { ReleaseRolloutEvent } from "@network/updates-queue";

import { ConfigService } from "../config/config-service";
import { CLIENT_CONNECTION } from "../client/client-connection";

@Injectable()
export class ClientService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(CLIENT_CONNECTION) private readonly clientService: Client<true>,
  ) {}

  public getUpdatesChannel() {
    const id = this.configService.updatesChannel;
    return <TextChannel>this.clientService.channels.resolve(id);
  }
}
