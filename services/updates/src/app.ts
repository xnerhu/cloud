import "reflect-metadata";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import multipart from "fastify-multipart";
import { mkdir } from "fs/promises";
import { NestHttpExceptionHandler } from "@common/nest";
import { IS_TEST } from "@common/node";

import { AppModule } from "./app-module";
import { TEST_UPDATES_PATH } from "./config/env";

export const runApp = async (port?: number) => {
  if (IS_TEST) {
    await mkdir(TEST_UPDATES_PATH!, { recursive: true });
  }

  const adapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const config = app.get(ConfigService);

  const defaultPort = config.get<number>("PORT", { infer: true });

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new NestHttpExceptionHandler(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.register(multipart as any, {});

  app.enableCors();

  await app.listen(port ?? defaultPort);

  return app;
};
