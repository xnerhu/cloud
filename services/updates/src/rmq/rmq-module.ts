import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { rmqProxyFactory } from "./rmq-proxy";

@Module({
  imports: [ConfigModule],
  providers: [rmqProxyFactory],
  exports: [rmqProxyFactory],
})
export class RMQModule {}
