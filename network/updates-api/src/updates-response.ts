import { ReleaseAssetFetchInfo } from "./assets-response";

export type UpdateStrategy = "patches" | "packed" | "none";

export interface UpdateResponse {
  strategy: UpdateStrategy;
  packed?: ReleaseAssetFetchInfo;
  patches?: ReleaseAssetFetchInfo[];
}

export type UpdateV1Strategy = "patches" | "full" | "none";

export interface UpdateV1Response {
  type: UpdateV1Strategy;
  patches?: UpdateEntryV1[];
  fullFile?: UpdateEntryV1;
}

export interface UpdateEntryV1 {
  url: string;
  filename: string;
}
