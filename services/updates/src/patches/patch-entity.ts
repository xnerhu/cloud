import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { Patch } from "@core/updates";

import { DistributionEntity } from "../distributions/distribution-entity";
import { ReleaseEntity } from "../releases/release-entity";

@Entity({ tableName: "patches" })
export class PatchEntity implements Patch {
  @PrimaryKey()
  id: number;

  @Property({ columnType: "text" })
  filename: string;

  @Property({ columnType: "text" })
  hash: string;

  @Property({ columnType: "integer" })
  size: number;

  @Property({ columnType: "text" })
  fullFilename: string;

  @Property({ columnType: "text" })
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
