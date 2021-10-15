import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { resolve } from "path";
import { IS_PRODUCTION } from "@common/node";

import { config } from "./mikro-orm-config";
import { SCHEMA_ENV } from "./config/env";
import { UpdatesModule } from "./updates/updates-module";
import { AdminModule } from "./admin/admin-module";

const PATH_ROOT = resolve(__dirname, "../");
@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    ConfigModule.forRoot({
      envFilePath: [
        resolve(PATH_ROOT, ".test.env"),
        resolve(PATH_ROOT, ".env"),
      ],
      cache: true,
      ignoreEnvFile: IS_PRODUCTION,
      validationSchema: SCHEMA_ENV,
    }),
    UpdatesModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
