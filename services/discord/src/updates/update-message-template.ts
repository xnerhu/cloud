import { HexColorString, MessageEmbed } from "discord.js";
import { ReleaseRolloutEvent } from "@network/updates-queue";
import { capitalizeFirstLetter } from "@common/utils";
import { Distribution } from "@core/updates";

import { formatPlatform, getOSEmoji } from "./message-utils";

const COLORS_CHANNELS: Record<string, string> = {
  alpha: "#8118bf",
  beta: "#00a6ff",
  stable: "#67ea76",
  none: "#d32f2f",
};

const getChannelColor = (channel: string) => {
  return (COLORS_CHANNELS[channel] ||
    COLORS_CHANNELS["none"]) as HexColorString;
};

const formatMessageTitle = (version: string, channel: string) => {
  return `Wexond ${version} ${capitalizeFirstLetter(channel)}`;
};

const formatMessagePlatforms = (
  list: Pick<Distribution, "os" | "architecture">[],
) => {
  return list
    .map((r) => `- ${formatPlatform(r.os)} ${r.architecture}`)
    .join("\n");
};

const formatMessageFooter = (osList: string[]) => {
  return osList.map(getOSEmoji).join(" ");
};

export const updateMessageTemplate = ({
  url,
  release,
  distributions,
}: ReleaseRolloutEvent & { url: string }): MessageEmbed => {
  return new MessageEmbed()
    .setColor(getChannelColor(release.channel))
    .setTitle(formatMessageTitle(release.version, release.channel))
    .setURL(url)
    .addField("Notes:", "\n" + release.notes ?? "none")
    .addField("Platforms: ", formatMessagePlatforms(distributions))
    .setTimestamp()
    .setFooter(formatMessageFooter(distributions.map((r) => r.os)));
};
