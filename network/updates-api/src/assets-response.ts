export interface AssetFetchInfo {
  url: string;
  filename: string;
  hash: string;
  size: number;
}

export interface ReleaseAssetFetchInfo extends AssetFetchInfo {
  version: string;
  notes: string;
}
