import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { AssetEntity } from "../../assets/asset-entity";
import { AssetsModule } from "../../assets/assets-module";
import { ConfigModule } from "../../config/config-module";
import { DistributionEntity } from "../../distributions/distribution-entity";
import { MessagingModule } from "../../messaging/messaging-module";
import { ReleaseEntity } from "../../releases/release-entity";
import { AdminController } from "./admin-controller";
import { AdminService } from "./admin-service";

@Module({
  imports: [
    MikroOrmModule.forFeature([AssetEntity, ReleaseEntity, DistributionEntity]),
    AssetsModule,
    ConfigModule,
    MessagingModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
