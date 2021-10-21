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

  @Property({ columnType: "text" })
  os: DistributionOS;

  @Property({ columnType: "text" })
  osVersion: DistributionOSVersion;

  @Property({ columnType: "text" })
  architecture: DistributionArchitecture;

  @OneToMany(() => PatchEntity, (patch) => patch.distribution)
  patches: PatchEntity[];

  @Property({ columnType: "timestamp" })
  createdAt: Date = new Date();
}
