import { MessageEmbed } from "discord.js";
import { capitalizeFirstLetter } from "@common/utils";

import {
  MessageMetadata,
  MessageMetadataDistribution,
} from "./message-metadata";
import { getMessageUrl } from "./message-utils";
import { getChannelColor } from "./channel";

export const formatMessageTitle = (version: string, channel: string) => {
  return `Wexond ${version} ${capitalizeFirstLetter(channel)}`;
};

export const getMessageFooter = (osList: string[]) => {
  return osList.map(getOSEmoji).join(" ");
};

export const formatMessagePlatforms = (list: MessageMetadataDistribution[]) => {
  return list
    .map((r) => `- ${capitalizeFirstLetter(r.os)} ${r.architecture}`)
    .join("\n");
};

export const getOSEmoji = (os: string) => {
  switch (os) {
    case "windows":
      return "🪟";
    case "apple":
      return "🍏";
    case "linux":
      return "🐧";
  }

  return "";
};

export const messageTemplate = (data: MessageMetadata) => {
  const url = getMessageUrl("https://discord.js.org", data);

  return new MessageEmbed()
    .setColor(getChannelColor(data.release.channel))
    .setTitle(formatMessageTitle(data.release.version, data.release.channel))
    .setURL(url)
    .addField("Notes:", "\n" + data.release.notes ?? "none")
    .addField("Platforms: ", formatMessagePlatforms(data.distributions))
    .setTimestamp()
    .setFooter(getMessageFooter(data.distributions.map((r) => r.os)));
};
