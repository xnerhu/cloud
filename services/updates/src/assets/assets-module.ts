import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { ConfigModule } from "../config/config-module";
import { AssetEntity } from "./asset-entity";
import { AssetsService } from "./assets-service";

@Module({
  imports: [MikroOrmModule.forFeature([AssetEntity]), ConfigModule],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
