export interface Distribution {
  id: number;
  os: string;
  osVersion: string;
  architecture: string;
  createdAt: Date;
}

export type DistributionOS = "windows" | "macos" | "linux";

export type DistributionArchitecture = "x64" | "arm";

export type DistributionOSVersion = "any";
