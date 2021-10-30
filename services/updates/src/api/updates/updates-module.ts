import { Module } from "@nestjs/common";

import { AssetsModule } from "../../assets/assets-module";
import { UpdatesController } from "./updates-controller";
import { UpdatesService } from "./updates-service";
import { UpdatesV1Controller } from "./updates-v1-controller";
import { UpdatesV1Service } from "./updates-v1-service";

@Module({
  imports: [AssetsModule],
  providers: [UpdatesService, UpdatesV1Service],
  controllers: [UpdatesController, UpdatesV1Controller],
})
export class UpdatesModule {}
