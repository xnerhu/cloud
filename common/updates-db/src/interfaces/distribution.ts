export interface Distribution {
  id: number;
  platform: DistributionPlatform;
  architecture: DistributionArchitecture;
  osVersion: DistributionOSVersion;
}

export type DistributionPlatform = 'windows' | 'macos' | 'linux';

export type DistributionArchitecture = 'x64' | 'arm';

export type DistributionOSVersion = 'any';
