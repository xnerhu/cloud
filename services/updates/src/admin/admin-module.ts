import { Module } from "@nestjs/common";

import { DistributionModule } from "../distributions/distributions-module";
import { PatchesModule } from "../patches/patches-module";
import { ReleasesModule } from "../releases/releases-module";
import { AdminController } from "./admin-controller";
import { AdminService } from "./admin-service";

@Module({
  imports: [DistributionModule, ReleasesModule, PatchesModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
