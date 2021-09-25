import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";

import { PatchEntity } from "./patch-entity";
import { PatchesService } from "./patches-service";

@Module({
  imports: [MikroOrmModule.forFeature([PatchEntity])],
  providers: [PatchesService],
  exports: [PatchesService],
})
export class PatchesModule {}
