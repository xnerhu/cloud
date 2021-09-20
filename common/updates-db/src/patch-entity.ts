import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Patch } from './interfaces';
import { DistributionEntity } from './distribution-entity';
import { ReleaseEntity } from './release-entity';

@Entity({ name: 'patches' })
export class PatchEntity implements Patch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hash: string;

  @Column()
  size: number;

  @Column()
  fullHash: string;

  @Column()
  fullSize: number;

  @ManyToOne(() => DistributionEntity, (distro) => distro.patches)
  distribution: DistributionEntity;

  @ManyToOne(() => ReleaseEntity, (release) => release.patches)
  release: ReleaseEntity;
}
