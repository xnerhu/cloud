import "reflect-metadata";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestErrorHandler } from "@common/nest";

import { AppModule } from "./app-module";

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

  await app.listen(port);

  return app;
};
