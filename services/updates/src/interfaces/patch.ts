import { Release } from "./release";
import { Distribution } from "./distribution";

export interface Patch {
  id: number;
  filename: string;
  hash: string;
  size: number;
  fullFilename: string;
  fullHash: string;
  fullSize: number;
  distribution: Distribution;
  release: Release;
  createdAt: string;
}
