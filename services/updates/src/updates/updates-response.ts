export type UpdateStrategy = "patches" | "full" | "none";

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
  full?: UpdateEntry;
  patches?: UpdateEntry[];
}

export interface UpdateV1Response {
  type: UpdateStrategy;
  patches?: UpdateEntryV1[];
  fullFile?: UpdateEntryV1;
}

export interface UpdateEntryV1 {
  url: string;
  filename: string;
}
