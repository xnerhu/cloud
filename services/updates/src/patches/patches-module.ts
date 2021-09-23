import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import {
  DistributionEntity,
  PatchEntity,
  ReleaseEntity,
} from '@common/updates-db';

import { PatchController } from './patches-controller';
import { PatchesService } from './patches-service';

@Module({
  imports: [
    MikroOrmModule.forFeature([PatchEntity, ReleaseEntity, DistributionEntity]),
    ConfigModule,
  ],
  providers: [PatchesService],
  controllers: [PatchController],
})
export class PatchModule {}
