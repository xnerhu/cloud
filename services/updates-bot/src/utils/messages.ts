import { parseURL } from "whatwg-url";
import { parse } from "query-string";
import { Collection, Message } from "discord.js";

import { ReleaseData } from "../updates/updates-service";

export const TOKEN_MESSAGE_DATA = "msg_data";

export interface ReleaseSearchQuery {
  releaseId: number;
  distribution: number;
}

export const findReleaseMessage = <T>(
  query: ReleaseSearchQuery,
  list: Collection<string, Message>,
): Message | undefined => {
  return list.find((message) => {
    const url = message.embeds?.[0]?.url;

    if (url == null) return false;

    const data = getMessageData(url);

    if (data?.releaseId !== query.releaseId) {
      return false;
    }

    return data.distributions?.find((r) => r.id === query.distribution) != null;
  });
};

export const getMessageData = (url: string) => {
  const data = parseURL(url);

  if (data && data.fragment) {
    const fragments = parse(data.fragment);

    if (fragments[TOKEN_MESSAGE_DATA] != null) {
      return JSON.parse(
        decodeURIComponent(fragments[TOKEN_MESSAGE_DATA] as string),
      ) as Partial<ReleaseData>;
    }
  }

  return null;
};

export const formatMessageData = (data: ReleaseData) => {
  return encodeURIComponent(JSON.stringify(data));
};
