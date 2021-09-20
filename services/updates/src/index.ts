import 'reflect-metadata';

import { join, normalize, resolve } from 'path';
import fastify from 'fastify';
import helmet from 'fastify-helmet';
import formBody from 'fastify-formbody';
import { createConnection } from 'typeorm';
import { ErrorHandler, handleNodeErrors, ServiceLogger } from '@common/node';
import { handleFastifyErrors } from '@common/fastify';

// import { ReleaseEntity } from './release/release-entity';

const main = async () => {
  //  const connection = await createConnection({
  //   type: 'mongodb',
  //   host: 'localhost',
  //   port: 27017,
  //   database: 'updates',
  //   username: 'root',
  //   password: 'example',
  //   entities: [ReleaseEntity],
  //   authSource: 'admin',
  // });
  // console.log('xd');
  // const prisma = new PrismaClient({
  //   datasources: {
  //     db: {
  //       url: 'mysql://root:example@localhost:3306/updates',
  //     },
  //   },
  // });
  // const xd = await prisma.release.create({
  //   data: { name: 'xd' },
  // });
  // console.log(xd);
  // prisma.release.
  // console.log(xd);
  // const logger = new ServiceLogger('Updates', resolve('out/logs.log'));
  // const errorHandler = new ErrorHandler(logger);
  // handleNodeErrors(logger);
  // const server = fastify();
  // server.register(helmet);
  // server.register(formBody);
  // handleFastifyErrors(server, errorHandler);
  // console.log('xdd');
  // api(server);
  // server.listen(SERVICE_PORT, async () => {
  //   this.logger.info(`Listening on port ${SERVICE_PORT}!`);
  // });
  // this.server = server;
  // this.connection = await createConnection({
  //   type: 'mongodb',
  //   host: 'localhost',
  //   port: 27017,
  //   database: 'updates',
  //   username: 'root',
  //   password: 'example',
  //   entities: [ReleaseEntity, DistributionEntity],
  // });
  // this.releaseController = new ReleaseController(
  //   this.connection.manager as MongoEntityManager,
  //   this.logger,
  // );
  // this.updateController = new UpdateController(
  //   this.releaseController,
  //   this.logger,
  // );
};

main();
