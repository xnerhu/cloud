import { Module } from "@nestjs/common";

import { ConfigModule } from "../config/config-module";
import { DistributionModule } from "../distributions/distributions-module";
import { PatchesModule } from "../patches/patches-module";
import { ReleasesModule } from "../releases/releases-module";
import { RMQModule } from "../rmq/rmq-module";
import { AdminController } from "./admin-controller";
import { AdminService } from "./admin-service";

@Module({
  imports: [
    DistributionModule,
    ReleasesModule,
    PatchesModule,
    ConfigModule,
    RMQModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
