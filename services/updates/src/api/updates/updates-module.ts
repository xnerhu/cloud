import { Module } from "@nestjs/common";

import { AssetsModule } from "../../assets/assets-module";
import { UpdatesController } from "./updates-controller";
import { UpdatesService } from "./updates-service";

@Module({
  imports: [AssetsModule],
  providers: [UpdatesService],
  controllers: [UpdatesController],
})
export class UpdatesModule {}
