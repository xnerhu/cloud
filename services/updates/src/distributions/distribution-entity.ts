import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  DateType,
} from "@mikro-orm/core";

import {
  DistributionArchitecture,
  DistributionOSVersion,
  DistributionOS,
  Distribution,
} from "../interfaces";
import { PatchEntity } from "../patches/patch-entity";

@Entity({ tableName: "distributions" })
export class DistributionEntity implements Distribution {
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

  @Property({ columnType: "timestamp", default: "now" })
  createdAt: string;
}
