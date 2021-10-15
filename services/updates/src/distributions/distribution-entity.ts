import { Entity, PrimaryKey, Property, OneToMany } from "@mikro-orm/core";

import {
  DistributionArchitecture,
  DistributionOSVersion,
  DistributionOS,
  Distribution,
} from "@core/updates";
import { PatchEntity } from "../patches/patch-entity";

@Entity({ tableName: "distributions" })
export class DistributionEntity implements Distribution {
  @PrimaryKey()
  id: number;

  @Property({ columnType: "varchar" })
  os: DistributionOS;

  @Property({ columnType: "varchar" })
  osVersion: DistributionOSVersion;

  @Property({ columnType: "varchar" })
  architecture: DistributionArchitecture;

  @OneToMany(() => PatchEntity, (patch) => patch.distribution)
  patches: PatchEntity[];

  @Property({ columnType: "timestamp" })
  createdAt: Date = new Date();
}
