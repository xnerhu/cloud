import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/core';

import { Release, ReleaseChannel } from '../interfaces';
import { PatchEntity } from '../patches/patch-entity';

@Entity({ tableName: 'releases' })
export class ReleaseEntity implements Release {
  @PrimaryKey()
  id: number;

  @Property()
  version: string;

  @Property()
  channel: ReleaseChannel;

  @OneToMany(() => PatchEntity, (patch) => patch.release)
  patches: PatchEntity[];

  @Property()
  notes: string;
}
