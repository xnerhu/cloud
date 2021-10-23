import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Asset, AssetType } from "@core/updates";

import { DistributionEntity } from "../distributions/distribution-entity";
import { ReleaseEntity } from "../releases/release-entity";

@Entity({ tableName: "assets" })
export class AssetEntity implements Asset {
  @PrimaryKey()
  id: number;

  @Index()
  @Enum(() => AssetType)
  type: number;

  @Property({ columnType: "text" })
  filename: string;

  @Property({ columnType: "text" })
  hash: string;

  @Property({ columnType: "integer" })
  size: number;

  @ManyToOne(() => DistributionEntity)
  distribution: DistributionEntity;

  @ManyToOne(() => ReleaseEntity)
  release: ReleaseEntity;

  @Property({ columnType: "timestamp" })
  createdAt: Date = new Date();
}
