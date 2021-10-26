import { Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Distribution } from "@core/updates";

import { AssetEntity } from "../assets/asset-entity";

export type DistributionEntityOptions = Omit<Distribution, "id" | "createdAt">;

@Entity({ tableName: "distributions" })
export class DistributionEntity implements Distribution {
  constructor(options?: DistributionEntityOptions) {
    if (options) {
      this.os = options.os;
      this.architecture = options.architecture;
    }
  }

  @PrimaryKey()
  id: number;

  @Property({ columnType: "text" })
  os: string;

  @Property({ columnType: "text" })
  architecture: string;

  @Property({ columnType: "timestamp" })
  createdAt: Date = new Date();

  @OneToMany(() => AssetEntity, (asset) => asset.distribution)
  assets: AssetEntity[];
}
