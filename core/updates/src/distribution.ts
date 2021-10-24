export interface Distribution {
  id: number;
  os: string;
  architecture: string;
  createdAt: Date;
}

export type DistributionOS = "windows" | "macos" | "linux";

export type DistributionArchitecture = "x64" | "arm";
