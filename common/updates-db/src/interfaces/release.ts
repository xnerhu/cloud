import { Patch } from './patch';

export interface Release {
  id: number;
  // semantic version
  tag: string;
  patches: Patch[];
  notes: string;
}
