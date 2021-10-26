import { Module } from "@nestjs/common";

import { ConfigModule } from "../config/config-module";
import { clientFactory } from "./client-connection";
import { ClientService } from "./client-service";

@Module({
  imports: [ConfigModule],
  providers: [clientFactory, ClientService],
  exports: [clientFactory, ClientService],
})
export class ClientModule {}
