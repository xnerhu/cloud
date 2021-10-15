import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Index,
} from "@mikro-orm/core";
import { Release } from "@core/updates";

import { PatchEntity } from "../patches/patch-entity";

@Entity({ tableName: "releases" })
export class ReleaseEntity implements Release {
  @PrimaryKey()
  id: number;

  @Property({ columnType: "varchar" })
  @Index()
  version: string;

  @Property({ columnType: "varchar" })
  @Index()
  channel: string;

  @OneToMany(() => PatchEntity, (patch) => patch.release)
  patches: PatchEntity[];

  @Property({ columnType: "varchar" })
  notes: string;

  @Property({ columnType: "timestamp" })
  createdAt: Date = new Date();
}
