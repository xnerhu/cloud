import { Asset } from "./asset";

export interface Release {
  id: number;
  /**
   * Semantic version
   */
  version: string;
  channel: string;
  assets: Asset[];
  notes: string;
  createdAt: Date;
}

export type ReleaseChannel = "alpha" | "beta" | "stable";
