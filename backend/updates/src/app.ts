import fastify, { FastifyInstance } from 'fastify';
import helmet from 'fastify-helmet';
import formBody from 'fastify-formbody';
import { resolve } from 'path';
import {
  ServiceLogger,
  ErrorHandler,
  handleFastifyErrors,
} from '@services/common';

import { SERVICE_PORT } from './constants';
import { ReleaseStore } from './releases/release-store';
import api from './api';

export class App {
  public static instance = new App();

  public logger = new ServiceLogger('Updates', resolve('out/logs.log'));

  public server: FastifyInstance;

  public releaseStore = new ReleaseStore();

  public errorHandler = new ErrorHandler(this.logger);

  public async init() {
    await this.releaseStore.init();

    const server = fastify();

    server.register(helmet);
    server.register(formBody);

    handleFastifyErrors(server, this.errorHandler);
    api(server);

    server.listen(SERVICE_PORT, async () => {
      this.logger.info(`Listening on port ${SERVICE_PORT}!`);
    });

    this.server = server;
  }
}
