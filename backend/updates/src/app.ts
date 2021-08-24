import fastify, { FastifyInstance } from 'fastify';
import helmet from 'fastify-helmet';
import formBody from 'fastify-formbody';
import { resolve } from 'path';
import { createConnection, Connection, MongoEntityManager } from 'typeorm';
import {
  ServiceLogger,
  ErrorHandler,
  handleFastifyErrors,
} from '@backend/common';

import { SERVICE_PORT } from './constants';
import { ReleaseStore } from './releases/release-store';
import api from './api';
import { ReleaseEntity } from './release/release-entity';
import { ReleaseController } from './release/release-controller';
import { DistributionEntity } from './release/distribution-entity';
import { UpdateController } from './release/update-controller';

export class App {
  public static instance = new App();

  public logger = new ServiceLogger('Updates', resolve('out/logs.log'));

  public server: FastifyInstance;

  public releaseStore = new ReleaseStore();

  public errorHandler = new ErrorHandler(this.logger);

  public connection: Connection;

  public releaseController: ReleaseController;

  public updateController: UpdateController;

  public async init() {
    // await this.releaseStore.init();

    const server = fastify();

    server.register(helmet);
    server.register(formBody);

    handleFastifyErrors(server, this.errorHandler);
    api(server);

    server.listen(SERVICE_PORT, async () => {
      this.logger.info(`Listening on port ${SERVICE_PORT}!`);
    });

    this.server = server;

    this.connection = await createConnection({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'updates',
      username: 'root',
      password: 'example',
      entities: [ReleaseEntity, DistributionEntity],
    });

    this.releaseController = new ReleaseController(
      this.connection.manager as MongoEntityManager,
      this.logger,
    );

    this.updateController = new UpdateController(
      this.releaseController,
      this.logger,
    );
  }
}
