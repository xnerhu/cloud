import { Distribution } from '@common/updates-db';

export interface Patch {
  id: number;
  hash: string;
  size: number;
  fullHash: string;
  fullSize: number;
  distribution: Distribution;
}
