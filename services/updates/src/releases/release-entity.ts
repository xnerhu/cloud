import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Index,
} from "@mikro-orm/core";

import { Release } from "../interfaces";
import { PatchEntity } from "../patches/patch-entity";

@Entity({ tableName: "releases" })
export class ReleaseEntity implements Release {
  @PrimaryKey()
  id: number;

  @Property()
  @Index()
  version: string;

  @Property()
  @Index()
  channel: string;

  @OneToMany(() => PatchEntity, (patch) => patch.release)
  patches: PatchEntity[];

  @Property()
  notes: string;
}
