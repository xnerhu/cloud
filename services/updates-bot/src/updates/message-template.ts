import { MessageEmbed } from "discord.js";
import { capitalizeFirstLetter } from "@common/utils";

import { formatMessageData, TOKEN_MESSAGE_DATA } from "../utils/messages";
import { ReleaseData } from "./updates-service";
import { getOSEmoji } from "../utils/distribution";
import { getChannelColor } from "./channels";

export const formatMessageTitle = (version: string, channel: string) => {
  return `Wexond ${version} ${capitalizeFirstLetter(channel)}`;
};

export const getMessageFooter = (osList: string[]) => {
  return osList.map(getOSEmoji).join(" ");
};

export const getMessagePlatforms = (
  list: {
    id: number;
    os: string;
    architecture: string;
  }[],
) => {
  return list
    .map((r) => `- ${capitalizeFirstLetter(r.os)} ${r.architecture}`)
    .join("\n");
};

export const messageTemplate = (data: ReleaseData) => {
  const url = `https://discord.js.org/#${TOKEN_MESSAGE_DATA}=${formatMessageData(
    data,
  )}`;

  return new MessageEmbed()
    .setColor(getChannelColor(data.channel) as any)
    .setTitle(formatMessageTitle(data.version, data.channel))
    .setURL(url)
    .addField("Notes:", "\n" + data.notes ?? "none")
    .addField("Platforms: ", getMessagePlatforms(data.distributions))
    .setTimestamp()
    .setFooter(getMessageFooter(data.distributions.map((r) => r.os)));
};
