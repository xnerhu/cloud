import {
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from "@nestjs/microservices";

import { ConfigService } from "../config/config-service";

export const RMQ_PROXY_TOKEN = "RMQ_PROXY_PROVIDER";

export const rmqProxyFactory = {
  provide: RMQ_PROXY_TOKEN,
  useFactory: (config: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [config.rmqUrl],
        queue: config.rmqQueue,
        queueOptions: {
          durable: false,
        } as RmqOptions["options"],
      },
    });
  },
  inject: [ConfigService],
};
