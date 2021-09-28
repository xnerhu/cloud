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
  createdAt: string;
}
