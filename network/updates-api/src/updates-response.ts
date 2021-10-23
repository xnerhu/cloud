export type UpdateStrategy = "patches" | "packed" | "none";

export interface UpdateEntry {
  version: string;
  url: string;
  filename: string;
  notes: string;
  hash: string;
  size: number;
}

export interface UpdateResponse {
  strategy: UpdateStrategy;
  packed?: UpdateEntry;
  patches?: UpdateEntry[];
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
