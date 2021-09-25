import { Entity, PrimaryKey, Property, OneToMany } from "@mikro-orm/core";

import {
  DistributionArchitecture,
  DistributionOSVersion,
  DistributionOS,
} from "../interfaces";
import { PatchEntity } from "../patches/patch-entity";

@Entity({ tableName: "distributions" })
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
