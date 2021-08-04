export interface ReleaseModel {
  version: string;
  patchFile: string;
  patchHash?: string;
  fullFile?: string;
  fullHash?: string;
  diffSize: number;
  fullSize?: number;
}

export interface UpdateModel {
  type: 'full' | 'patches' | 'none';
  patches?: UpdateFileModel[];
  fullFile?: UpdateFileModel;
}

export interface UpdateFileModel {
  filename: string;
  size: number;
  url: string;
  hash?: string;
}
