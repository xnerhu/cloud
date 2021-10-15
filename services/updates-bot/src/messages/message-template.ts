import { MessageEmbed } from "discord.js";
import { capitalizeFirstLetter } from "@common/utils";
import { NewUpdateEvent } from "@network/updates-queue";

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

export const formatPlatform = (os: string) => {
  switch (os) {
    case "macos":
      return "macOS";
    default:
      return os;
  }
};

export const formatMessagePlatforms = (list: MessageMetadataDistribution[]) => {
  return list
    .map((r) => `- ${formatPlatform(r.os)} ${r.architecture}`)
    .join("\n");
};

export const getOSEmoji = (os: string) => {
  switch (os) {
    case "windows":
      return "🪟";
    case "macos":
      return "🍏";
    case "linux":
      return "🐧";
  }

  return "";
};

export const messageTemplate = (e: NewUpdateEvent, data: MessageMetadata) => {
  const url = getMessageUrl("https://discord.js.org", data);

  return new MessageEmbed()
    .setColor(getChannelColor(e.release.channel))
    .setTitle(formatMessageTitle(e.release.version, e.release.channel))
    .setURL(url)
    .addField("Notes:", "\n" + e.release.notes ?? "none")
    .addField("Platforms: ", formatMessagePlatforms(data.distributions))
    .setTimestamp()
    .setFooter(getMessageFooter(data.distributions.map((r) => r.os)));
};
