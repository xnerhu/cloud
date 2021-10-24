import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Index,
  Enum,
} from "@mikro-orm/core";
import { Release, ReleaseStatusType } from "@core/updates";

import { AssetEntity } from "../assets/asset-entity";

export type ReleaseEntityOptions = Omit<
  ReleaseEntity,
  "id" | "createdAt" | "distribution" | "assets"
> & {
  assets: AssetEntity[];
};

@Entity({ tableName: "releases" })
export class ReleaseEntity implements Release {
  constructor(options?: ReleaseEntityOptions) {
    if (options) {
      this.version = options.version;
      this.channel = options.channel;
      this.assets = options.assets;
      this.status = options.status;
      this.notes = options.notes;
    }
  }

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

  @Index()
  @Enum(() => ReleaseStatusType)
  status: number = ReleaseStatusType.SUSPENDED;

  @Property({ columnType: "text" })
  notes: string;

  @Property({ columnType: "timestamp" })
  createdAt: Date = new Date();
}
