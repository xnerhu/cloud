import { Patch } from "./patch";

export interface Distribution {
  id: number;
  os: DistributionOS;
  osVersion: DistributionOSVersion;
  architecture: DistributionArchitecture;
  patches: Patch[];
  createdAt: Date;
}

export type DistributionOS = "windows" | "macos" | "linux";

export type DistributionArchitecture = "x64" | "arm";

export type DistributionOSVersion = "any";
