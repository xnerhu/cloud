import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "path";

import { IS_PRODUCTION } from "@common/node";
import { SCHEMA_ENV } from "./config/env";
import { UpdatesModule } from "./updates/updates-module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, "../.env"),
      cache: true,
      ignoreEnvFile: IS_PRODUCTION,
      validationSchema: SCHEMA_ENV,
    }),
    UpdatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
