import { Distribution } from "./distribution";
import { Release } from "./release";

export interface Asset {
  id: number;
  type: AssetType;
  filename: string;
  hash: string;
  size: number;
  distribution: Distribution;
  release: Release;
  createdAt: Date;
}

export enum AssetType {
  PATCH = 0,
  PACKED,
  INSTALLER,
}
