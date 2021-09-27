import { Patch } from "./patch";

export interface Release {
  id: number;
  /**
   * Semantic version
   */
  version: string;
  channel: string;
  patches: Patch[];
  notes: string;
  createdAt: string;
}

export type ReleaseChannel = "stable" | "alpha";
