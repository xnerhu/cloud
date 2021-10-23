import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Index,
} from "@mikro-orm/core";
import { Release } from "@core/updates";

import { AssetEntity } from "../assets/asset-entity";

@Entity({ tableName: "releases" })
export class ReleaseEntity implements Release {
  @PrimaryKey()
  id: number;

  @Index()
  @Property({ columnType: "text" })
  version: string;

  @Index()
  @Property({ columnType: "text" })
  channel: string;

  @OneToMany(() => AssetEntity, (asset) => asset.release)
  assets: AssetEntity[];

  @Property({ columnType: "text" })
  notes: string;

  @Property({ columnType: "timestamp" })
  createdAt: Date = new Date();
}
