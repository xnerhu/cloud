import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";

import { ReleaseEntity } from "./release-entity";
import { ReleasesService } from "./releases-service";

@Module({
  imports: [MikroOrmModule.forFeature([ReleaseEntity])],
  providers: [ReleasesService],
  exports: [ReleasesService],
})
export class ReleasesModule {}
