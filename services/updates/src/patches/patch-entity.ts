import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";

import { Patch } from "../interfaces";
import { DistributionEntity } from "../distributions/distribution-entity";
import { ReleaseEntity } from "../releases/release-entity";

@Entity({ tableName: "patches" })
export class PatchEntity implements Patch {
  @PrimaryKey()
  id: number;

  @Property()
  filename: string;

  @Property()
  hash: string;

  @Property()
  size: number;

  @Property()
  fullFilename: string;

  @Property()
  fullHash: string;

  @Property()
  fullSize: number;

  @ManyToOne(() => DistributionEntity)
  distribution: DistributionEntity;

  @ManyToOne(() => ReleaseEntity)
  release: ReleaseEntity;

  @Property({ columnType: "timestamp", default: "now" })
  createdAt: string;
}
