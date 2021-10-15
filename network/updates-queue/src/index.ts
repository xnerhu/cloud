import { Release, Distribution } from "@core/updates";

export interface NewUpdateEvent {
  release: Release;
  distribution: Distribution;
}

export const PATTERN_NEW_UPDATE = "new-update";
