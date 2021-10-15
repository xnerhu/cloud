import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client, Message, MessageEmbed, TextChannel } from "discord.js";

import { DISCORD_CONNECTION } from "../discord/discord-connection";
import {
  findReleaseMessage,
  formatMessageData,
  ReleaseSearchQuery,
  TOKEN_MESSAGE_DATA,
} from "../utils/messages";
import { messageTemplate } from "./message-template";

export interface ReleaseData {
  version: string;
  releaseId: number;
  distributions: {
    id: number;
    os: string;
    architecture: string;
  }[];
  notes?: string;
  channel: "alpha" | "beta" | "stable";
}

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

  private async findReleaseMessage(data: ReleaseSearchQuery) {
    const messages = await this.getChannel().messages.fetch({ limit: 16 });

    return findReleaseMessage(data, messages);
  }

  private async editMessage(message: Message) {
    message.edit({ embeds: [] });
  }

  private async createMessage(data: ReleaseData) {
    const embed = messageTemplate(data);

    await this.getChannel().send({ embeds: [embed] });
  }

  public async sendDiscordMessage(data: any) {
    const channelId = this.configService.get("DISCORD_CHANNEL") as string;

    const channel = <TextChannel>this.clientService.channels.resolve(channelId);

    const releaseData: ReleaseData = {
      version: "6.9.0",
      channel: "stable",
      notes: "- Fixed React\n- Added npm",
      releaseId: data.release.id,
      distributions: [
        {
          id: data.distribution.id,
          architecture: "x64",
          os: "windows",
        },
      ],
    };

    await this.createMessage(releaseData);

    // const msg = await this.findReleaseMessage({
    //   releaseId: data.release.id,
    //   distribution: data.distribution.id,
    // });

    // if (msg) {
    //   await this.editMessage(msg);
    // }

    // const exampleEmbed = new MessageEmbed()
    //   .setColor("#67ea76")
    //   .setTitle("Wexond 1.0.0 Stable")
    //   .setURL(
    //     `https://discord.js.org/#${TOKEN_MESSAGE_DATA}=${formatMessageData(
    //       releaseData,
    //     )}`,
    //   )
    //   .addField("Changelog:", "- Fixed react\n- Added popup")
    //   .addField("Platforms: ", "- Windows x64")
    //   .setTimestamp()
    //   .setFooter("🪟 🍏 🐧");

    // await channel.send({ embeds: [exampleEmbed] }); // `Wexond 1.0.0 Alpha released!\nxd`
    // await this.findReleaseMessage();
    // const messages = await channel.messages.fetch({ limit: 16 });

    // messages.find(r => r.components.fi
    // console.log(messages.first()?.embeds);

    // // messages.find(msg => msg.content
  }
}
