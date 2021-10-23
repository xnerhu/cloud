import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { DistributionArchitecture, Distribution } from "@core/updates";

@Entity({ tableName: "distributions" })
export class DistributionEntity implements Distribution {
  @PrimaryKey()
  id: number;

  @Property({ columnType: "text" })
  os: string;

  @Property({ columnType: "text" })
  osVersion: string;

  @Property({ columnType: "text" })
  architecture: DistributionArchitecture;

  @Property({ columnType: "timestamp" })
  createdAt: Date = new Date();
}
