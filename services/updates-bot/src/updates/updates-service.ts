import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client, TextChannel } from "discord.js";
import { NewUpdateEvent } from "@network/updates-queue";

import { DISCORD_CONNECTION } from "../discord/discord-connection";
import { messageTemplate } from "../messages/message-template";
import {
  findMessage,
  getMessageEmbedUrl,
  MessageSearchQuery,
} from "../messages/message-utils";
import {
  decodeMessageMetadata,
  MessageMetadataDistribution,
} from "../messages/message-metadata";
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

  public async sendDiscordMessage(e: NewUpdateEvent) {
    const channel = this.getChannel();

    const message = await this.findMessage({
      releaseId: e.release.id,
    });

    const distribution: MessageMetadataDistribution = {
      id: e.distribution.id,
      os: e.distribution.os,
      architecture: e.distribution.architecture,
    };

    const url = message && getMessageEmbedUrl(message);

    if (!message || !url) {
      const embed = messageTemplate(e, {
        releaseId: e.release.id,
        distributions: [distribution],
      });

      await channel.send({ embeds: [embed] });

      return;
    }

    const metadata = decodeMessageMetadata(url);

    if (!metadata) {
      throw new Error("Metadata is empty");
    }

    const embed = messageTemplate(e, {
      releaseId: e.release.id,
      distributions: [...metadata.distributions, distribution],
    });

    await message.edit({ embeds: [embed] });
  }

  private async findMessage(data: MessageSearchQuery) {
    const messages = await this.getChannel().messages.fetch({ limit: 16 });

    return findMessage(data, messages);
  }
}
