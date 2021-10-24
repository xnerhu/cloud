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

export type AssetEntityOptions = Omit<
  Asset,
  "id" | "createdAt" | "distribution" | "release"
> & {
  distribution: DistributionEntity;
};

@Entity({ tableName: "assets" })
export class AssetEntity implements Asset {
  constructor(options?: AssetEntityOptions) {
    if (options) {
      this.type = options.type;
      this.filename = options.filename;
      this.hash = options.hash;
      this.size = options.size;
      this.distribution = options.distribution;
    }
  }

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
