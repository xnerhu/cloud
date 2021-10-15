import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client, TextChannel } from "discord.js";
import { NewUpdateEvent } from "@network/updates-queue";

import { DISCORD_CONNECTION } from "../discord/discord-connection";
import { messageTemplate } from "../messages/message-template";
import { findMessage, MessageSearchQuery } from "../messages/message-utils";
import { decodeMessageMetadata } from "../messages/message-metadata";
@Injectable()
export class UpdatesService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(DISCORD_CONNECTION) private readonly clientService: Client<true>,
  ) {}

  private getChannel() {
    const id = this.configService.get("DISCORD_CHANNEL") as string;

    return <TextChannel>this.clientService.channels.resolve(id);
  }

  public async sendDiscordMessage(data: NewUpdateEvent) {
    const channel = this.getChannel();

    const message = await this.findMessage({
      releaseId: data.release.id,
      distributionId: data.distribution.id,
    });

    if (!message) {
      const embed = messageTemplate({
        release: data.release,
        distributions: [data.distribution],
      });

      await channel.send({ embeds: [embed] });

      return;
    }

    const metadata = decodeMessageMetadata(message.url)!;

    const embed = messageTemplate({
      release: data.release,
      distributions: [...metadata.distributions, data.distribution],
    });

    message.edit({ embeds: [embed] });
  }

  private async findMessage(data: MessageSearchQuery) {
    const messages = await this.getChannel().messages.fetch({ limit: 16 });

    return findMessage(data, messages);
  }
}
