// import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import {
  Distribution,
  DistributionArchitecture,
  DistributionOSVersion,
  DistributionOS,
} from './interfaces';
import { PatchEntity } from './patch-entity';

// @Entity({ name: 'distributions' })
// export class DistributionEntity implements Distribution {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   os: DistributionOS;

//   @Column()
//   osVersion: DistributionOSVersion;

//   @Column()
//   architecture: DistributionArchitecture;

//   @OneToMany(() => PatchEntity, (patch) => patch.distribution)
//   patches: PatchEntity[];
// }

import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/core';

@Entity({ tableName: 'distributions' })
export class DistributionEntity {
  @PrimaryKey()
  id: number;

  @Property()
  os: DistributionOS;

  @Property()
  osVersion: DistributionOSVersion;

  @Property()
  architecture: DistributionArchitecture;

  @OneToMany(() => PatchEntity, (patch) => patch.distribution)
  patches: PatchEntity[];
}
