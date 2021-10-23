import { Module } from "@nestjs/common";

import { AdminModule } from "./admin/admin-module";
import { UpdatesModule } from "./updates/updates-module";

const MODULES = [UpdatesModule, AdminModule];

@Module({
  imports: MODULES,
  exports: MODULES,
})
export class ApiModule {}
