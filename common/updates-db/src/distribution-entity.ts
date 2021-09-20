import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import {
  Distribution,
  DistributionArchitecture,
  DistributionOSVersion,
  DistributionPlatform,
} from './interfaces';
import { PatchEntity } from './patch-entity';

@Entity({ name: 'distributions' })
export class DistributionEntity implements Distribution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  platform: DistributionPlatform;

  @Column()
  architecture: DistributionArchitecture;

  @Column()
  osVersion: DistributionOSVersion;

  @OneToMany(() => PatchEntity, (patch) => patch.distribution)
  patches: PatchEntity[];
}
