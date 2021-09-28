import "reflect-metadata";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import multipart, { FastifyMultipartOptions } from "fastify-multipart";
import { NestErrorHandler } from "@common/nest";

import { AppModule } from "./app-module";
import { FastifyInstance } from "fastify";

export const runApp = async () => {
  const adapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const config = app.get(ConfigService);
  const port = config.get<number>("PORT", { infer: true });

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new NestErrorHandler(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());

  // (adapter.getInstance() as FastifyInstance).register(multipart, {
  //   addToBody: true,
  // });

  app.register(multipart as any, {} as FastifyMultipartOptions);

  // app.register( as any);
  app.enableCors();

  await app.listen(port);

  return app;
};
