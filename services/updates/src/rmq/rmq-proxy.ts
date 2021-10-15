import { ConfigService } from "@nestjs/config";
import {
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from "@nestjs/microservices";

export const RMQ_PROXY_TOKEN = "RMQ_PROXY_PROVIDER";

export const rmqProxyFactory = {
  provide: RMQ_PROXY_TOKEN,
  useFactory: (config: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [config.get<string>("RMQ_URL") as string],
        queue: config.get<string>("RMQ_QUEUE"),
        queueOptions: {
          durable: false,
        } as RmqOptions["options"],
      },
    });
  },
  inject: [ConfigService],
};
