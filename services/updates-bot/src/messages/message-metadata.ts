import { parseURL } from "whatwg-url";
import { parse } from "query-string";
import { Distribution } from "@core/updates";

export interface MessageMetadata {
  releaseId: number;
  distributions: MessageMetadataDistribution[];
}

export type MessageMetadataDistribution = Pick<
  Distribution,
  "id" | "architecture" | "os"
>;

export const TOKEN_MESSAGE_METADATA = "metadata";

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

      if (data.releaseId == null || !data.distributions?.length) {
        return null;
      }

      return data as MessageMetadata;
    }
  }

  return null;
};
