import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';

export type DistributionPlatform = 'windows' | 'macos' | 'linux';

export type DistributionArchitecture = 'x64' | 'arm';

export type DistributionOSVersion = 'any';

export interface DistributionQuery {
  platform: DistributionPlatform;
  architecture: DistributionArchitecture;
  osVersion: DistributionOSVersion;
}

@Entity({ name: 'distributions' })
export class DistributionEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  platform: DistributionPlatform;

  @Column()
  architecture: DistributionArchitecture;

  @Column()
  osVersion: DistributionOSVersion;
}
