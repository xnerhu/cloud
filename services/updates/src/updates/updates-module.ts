import { Module } from "@nestjs/common";

import { ConfigModule } from "../config/config-module";
import { DistributionModule } from "../distributions/distributions-module";
import { PatchesModule } from "../patches/patches-module";
import { UpdatesController } from "./updates-controller";
import { UpdatesService } from "./updates-service";

@Module({
  imports: [PatchesModule, DistributionModule, ConfigModule],
  providers: [UpdatesService],
  controllers: [UpdatesController],
})
export class UpdatesModule {}
