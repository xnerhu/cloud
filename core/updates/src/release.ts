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
  status: ReleaseStatusType;
  createdAt: Date;
}

export type ReleaseChannel = "alpha" | "beta" | "stable";

export enum ReleaseStatusType {
  SUSPENDED = 0,
  ROLLED_OUT,
}
