import { parseURL } from "whatwg-url";
import { parse } from "query-string";
import { Distribution, Release } from "@core/updates";

export interface MessageMetadata {
  release: MessageMetadataRelease;
  distributions: MessageMetadataDistribution[];
}

export type MessageMetadataRelease = Pick<
  Release,
  "id" | "channel" | "version" | "notes"
>;

export type MessageMetadataDistribution = Pick<
  Distribution,
  "id" | "architecture" | "os"
>;

const TOKEN_MESSAGE_METADATA = "metadata";

export const encodeMessageMetadata = (data: MessageMetadata) => {
  return encodeURIComponent(JSON.stringify(data));
};

export const decodeMessageMetadata = (url: string) => {
  const data = parseURL(url);

  if (data && data.fragment) {
    const fragments = parse(data.fragment);

    if (fragments[TOKEN_MESSAGE_METADATA] != null) {
      const data = JSON.parse(
        decodeURIComponent(fragments[TOKEN_MESSAGE_METADATA] as string),
      ) as Partial<MessageMetadata>;

      if (data.release?.id == null || !data.distributions?.length) {
        return null;
      }

      return data as MessageMetadata;
    }
  }

  return null;
};
