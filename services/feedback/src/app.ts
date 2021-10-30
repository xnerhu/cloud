import "reflect-metadata";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import multipart from "fastify-multipart";
import { HttpExceptionHandler } from "@common/nest";

import { AppModule } from "./app-module";
import { ConfigService } from "./config/config-service";

export const runApp = async (port?: number) => {
  const adapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const config = app.get(ConfigService);

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new HttpExceptionHandler(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.register(multipart as any, {});

  app.enableCors();

  const listenPort = port ?? config.port;

  await app.listen(listenPort, "0.0.0.0", (err, address) => {
    if (err) throw err;
    console.log(`Listening on ${address}`);
  });

  return app;
};
