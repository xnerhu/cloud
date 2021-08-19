export interface ReleaseModel {
  version: string;
  patchFile: string;
  fullFile: string;
  diffSize: number;
  fullSize: number;
}

export interface UpdateModel {
  type: 'full' | 'patches' | 'none';
  patches?: ReleaseFileModel[];
  fullFile?: ReleaseFileModel;
}

export interface ReleaseFileModel {
  filename: string;
  url: string;
}