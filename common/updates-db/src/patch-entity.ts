import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';

import { Patch } from './interfaces';
import { DistributionEntity } from './distribution-entity';
import { ReleaseEntity } from './release-entity';

@Entity({ tableName: 'patches' })
export class PatchEntity implements Patch {
  @PrimaryKey()
  id: number;

  @Property()
  hash: string;

  @Property()
  size: number;

  @Property()
  fullHash: string;

  @Property()
  fullSize: number;

  @ManyToOne(() => DistributionEntity)
  distribution: DistributionEntity;

  @ManyToOne(() => ReleaseEntity)
  release: ReleaseEntity;
}