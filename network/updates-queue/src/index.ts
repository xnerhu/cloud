import { Release, Distribution } from "@core/updates";

export interface ReleaseRolloutEvent {
  release: Pick<Release, "id" | "version" | "channel" | "notes">;
  distributions: Pick<Distribution, "id" | "os" | "architecture">[];
}

export const PATTERN_RELEASE_ROLLOUT_EVENT = "release-rollout";
