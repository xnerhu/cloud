import fastify, { FastifyInstance } from 'fastify';
import helmet from 'fastify-helmet';
import formBody from 'fastify-formbody';
import { resolve } from 'path';
import multipart from 'fastify-multipart';
import {
  ServiceLogger,
  ErrorHandler,
  handleFastifyErrors,
  ensureFolder,
} from '@services/common';

import { PATH_FILES, SERVICE_PORT, UPLOAD_MAX_FILE_SIZE } from './constants';
import api from './api';
import { ReleaseController } from './releases/release-controller';
import { ReleaseStorage } from './releases/release-storage';

export class App {
  public static instance = new App();

  public logger = new ServiceLogger('Updates', resolve('out/logs.log'));

  public server: FastifyInstance;

  public releaseStorage = new ReleaseStorage(this.logger);

  public releaseController = new ReleaseController(
    this.releaseStorage,
    this.logger,
  );

  public errorHandler = new ErrorHandler(this.logger);

  public async init() {
    await ensureFolder(PATH_FILES);
    await this.releaseStorage.init();

    const server = fastify();

    server.register(helmet);
    server.register(formBody);

    server.register(multipart, {
      attachFieldsToBody: true,
      addToBody: true,
      throwFileSizeLimit: true,
      limits: {
        files: 2,
        fileSize: UPLOAD_MAX_FILE_SIZE,
      },
    });

    handleFastifyErrors(server, this.errorHandler);
    api(server, this.logger);

    server.listen(SERVICE_PORT, async () => {
      this.logger.info(`Listening on port ${SERVICE_PORT}!`);
    });

    this.server = server;
  }
}
