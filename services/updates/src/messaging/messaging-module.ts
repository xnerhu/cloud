import { Module } from "@nestjs/common";

import { ConfigModule } from "../config/config-module";
import { rmqProxyFactory } from "./rmq-proxy";

@Module({
  imports: [ConfigModule],
  providers: [rmqProxyFactory],
  exports: [rmqProxyFactory],
})
export class MessagingModule {}
