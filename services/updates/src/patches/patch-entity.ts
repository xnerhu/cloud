import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";

import { Patch } from "../interfaces";
import { DistributionEntity } from "../distributions/distribution-entity";
import { ReleaseEntity } from "../releases/release-entity";

@Entity({ tableName: "patches" })
export class PatchEntity implements Patch {
  @PrimaryKey()
  id: number;

  @Property({ columnType: "varchar" })
  filename: string;

  @Property({ columnType: "varchar" })
  hash: string;

  @Property({ columnType: "integer" })
  size: number;

  @Property({ columnType: "varchar" })
  fullFilename: string;

  @Property({ columnType: "varchar" })
  fullHash: string;

  @Property({ columnType: "integer" })
  fullSize: number;

  @ManyToOne(() => DistributionEntity)
  distribution: DistributionEntity;

  @ManyToOne(() => ReleaseEntity)
  release: ReleaseEntity;

  @Property({ columnType: "timestamp" })
  createdAt: Date = new Date();
}
