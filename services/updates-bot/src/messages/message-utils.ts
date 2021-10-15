import { Collection, Message } from "discord.js";

import {
  decodeMessageMetadata,
  encodeMessageMetadata,
  MessageMetadata,
  TOKEN_MESSAGE_METADATA,
} from "./message-metadata";

export interface MessageSearchQuery {
  releaseId: number;
}

export const matchMessageUrl = (query: MessageSearchQuery, url: string) => {
  const data = decodeMessageMetadata(url);

  return data?.releaseId === query.releaseId;
};

export const getMessageEmbedUrl = (message: Message) => {
  return message.embeds?.[0]?.url;
};

export const findMessage = (
  query: MessageSearchQuery,
  list: Collection<string, Message>,
): Message | undefined => {
  return list.find((message) => {
    const url = getMessageEmbedUrl(message);

    if (url == null) return false;

    return matchMessageUrl(query, url);
  });
};

export const getMessageUrl = (url: string, data: MessageMetadata) => {
  return `${url}#${TOKEN_MESSAGE_METADATA}=${encodeMessageMetadata(data)}`;
};
