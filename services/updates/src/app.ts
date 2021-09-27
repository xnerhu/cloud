import "reflect-metadata";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import multipart from "fastify-multipart";
import { NestErrorHandler } from "@common/nest";

import { AppModule } from "./app-module";
import { IS_DEV } from "@common/node";

export const runApp = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>("PORT", { infer: true });

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new NestErrorHandler(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());

  app.register(multipart as any);
  app.enableCors();

  console.log(port);

  await app.listen(port);

  return app;
};
