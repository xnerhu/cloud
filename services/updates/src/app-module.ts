import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { resolve } from 'path';
import { IS_DEV } from '@common/node';

import { config } from './mikro-orm-config';
import { SCHEMA_ENV } from './config/env';
import { UpdatesModule } from './updates/updates-module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, '../.env'),
      cache: true,
      ignoreEnvFile: !IS_DEV,
      validationSchema: SCHEMA_ENV,
    }),
    UpdatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
