import { Release, Distribution } from "@core/updates";

export interface NewUpdateEvent {
  release: Pick<Release, "id" | "version" | "channel" | "notes">;
  distribution: Pick<Distribution, "id" | "os" | "osVersion" | "architecture">;
}

export const PATTERN_NEW_UPDATE = "new-update";
