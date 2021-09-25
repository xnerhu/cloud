import { Distribution } from './distribution';

export interface Patch {
  id: number;
  hash: string;
  size: number;
  fullHash: string;
  fullSize: number;
  distribution: Distribution;
}
