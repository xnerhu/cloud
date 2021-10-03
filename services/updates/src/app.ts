import "reflect-metadata";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import multipart, {
  FastifyMultipartAttactFieldsToBodyOptions,
  FastifyMultipartOptions,
  MultipartFile,
} from "fastify-multipart";
import { NestErrorHandler } from "@common/nest";

import { AppModule } from "./app-module";
import { FastifyInstance } from "fastify";
import { createWriteStream } from "fs";
import { unlink } from "fs/promises";
import { pump } from "@common/node";
import { resolve } from "path";

const onFile = async (part: MultipartFile) => {
  const path = resolve(part.filename);

  await pump(part.file, createWriteStream(path));

  if ((part.file as any).truncated) {
    await unlink(path);
  }
};

export const runApp = async (port?: number) => {
  const adapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const config = app.get(ConfigService);
  const defaultPort = config.get<number>("PORT", { infer: true });

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new NestErrorHandler(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.register(multipart as any, {});

  app.enableCors();

  await app.listen(port ?? defaultPort);

  return app;
};
