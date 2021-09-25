import { Patch } from './patch';

export interface Release {
  id: number;
  // semantic
  version: string;
  channel: ReleaseChannel;
  patches: Patch[];
  notes: string;
}

export type ReleaseChannel = 'stable' | 'alpha';
