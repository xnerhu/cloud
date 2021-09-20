import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Release } from './interfaces';
import { PatchEntity } from './patch-entity';

@Entity({ name: 'releases' })
export class ReleaseEntity implements Release {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;

  @OneToMany(() => PatchEntity, (patch) => patch.release)
  patches: PatchEntity[];

  @Column()
  notes: string;
}
