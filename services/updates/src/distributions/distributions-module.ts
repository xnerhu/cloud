import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";

import { DistributionEntity } from "./distribution-entity";
import { DistributionsService } from "./distributions-service";

@Module({
  imports: [MikroOrmModule.forFeature([DistributionEntity])],
  providers: [DistributionsService],
  exports: [DistributionsService],
})
export class DistributionModule {}
