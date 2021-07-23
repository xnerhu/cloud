export interface ReleaseModel {
  version: string;
  patch_file: string;
  full_file: string;
  diff_size: number;
  full_size: number;
}

export interface UpdateModel {
  type: 'full' | 'patches' | 'none';
  files?: string[];
}
