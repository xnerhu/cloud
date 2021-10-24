import { AssetFetchInfo } from "./assets-response";

export interface AdminCreateReleaseResponse {
  releaseId: number;
  created: boolean;
}

export interface AdminGetDiffInfoResponse {
  asset: AssetFetchInfo;
}

export interface AdminUploadAssetResponse {
  asset: AssetFetchInfo;
}

export interface AdminChangeStatusResponse {
  changed: boolean;
}
