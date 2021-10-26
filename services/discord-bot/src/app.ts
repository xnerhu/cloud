import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { AppModule } from "./app-module";
import { getRMQConfig } from "./config/env";

export const runApp = async () => {
  const config = getRMQConfig();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [config.url],
        queue: config.queue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
};
