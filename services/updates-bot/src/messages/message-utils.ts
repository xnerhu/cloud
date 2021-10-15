import { Collection, Message } from "discord.js";

import {
  decodeMessageMetadata,
  encodeMessageMetadata,
  MessageMetadata,
} from "./message-metadata";

export const TOKEN_MESSAGE_DATA = "msg_data";

export interface MessageSearchQuery {
  releaseId: number;
  distributionId: number;
}

export const matchMessageUrl = (query: MessageSearchQuery, url: string) => {
  const data = decodeMessageMetadata(url);

  if (data?.release.id !== query.releaseId || !data.distributions.length) {
    return false;
  }

  return data.distributions.some((r) => r.id === query.distributionId);
};

export const findMessage = <T>(
  query: MessageSearchQuery,
  list: Collection<string, Message>,
): Message | undefined => {
  return list.find((message) => {
    const url = message.embeds?.[0]?.url;

    if (url == null) return false;

    return matchMessageUrl(query, url);
  });
};

export const getMessageUrl = (url: string, data: MessageMetadata) => {
  return `${url}#${TOKEN_MESSAGE_DATA}=${encodeMessageMetadata(data)}`;
};
