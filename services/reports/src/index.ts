import fastify from 'fastify';
import helmet from 'fastify-helmet';
import formBody from 'fastify-formbody';
import multipart from 'fastify-multipart';
import { ensurePath } from '@services/common';

import { RAPORT_SCREENSHOT_MAX_SIZE, SERVICE_PORT } from './constants/config';
import { MailService } from './mail-service';
import api from './api';
import { PATH_OUT } from './constants/paths';
import { Logger } from './logger';

const app = fastify();

app.register(helmet);
app.register(formBody);
app.register(multipart, {
  limits: {
    fieldNameSize: 100,
    fieldSize: 100,
    fields: 10,
    fileSize: RAPORT_SCREENSHOT_MAX_SIZE,
    files: 1,
    headerPairs: 2000,
  },
  addToBody: true,
  attachFieldsToBody: true,
});

api(app);

const main = async () => {
  await ensurePath(PATH_OUT);

  MailService.instance.init();

  app.listen(SERVICE_PORT, async () => {
    Logger.instance.info(`Listening on port ${SERVICE_PORT}!`);
  });
};

process.on('uncaughtException', (err) => {
  Logger.instance.warn(`Uncaught Exception: ${err.message}`);
});

process.on('unhandledRejection', (err) => {
  Logger.instance.warn(`Unhandled Rejection: ${err}`);
});

main();
