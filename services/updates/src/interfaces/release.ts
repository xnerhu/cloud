export interface ReleaseModel {
  version: string;
  patchFile: string;
  fullFile: string;
  diffSize: number;
  fullSize: number;
}

export interface UpdateModel {
  type: 'full' | 'patches' | 'none';
  files?: string[];
}
