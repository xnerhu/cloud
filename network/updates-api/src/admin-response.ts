import { UpdateEntry } from "./updates-response";

export interface AdminCreateReleaseResponse {
  releaseId: number;
  created: boolean;
}

export type AdminGetDiffInfoResponse = Omit<UpdateEntry, "notes">;

export interface AdminUploadPatchResponse {
  patch: UpdateEntry;
  packed: UpdateEntry;
}
