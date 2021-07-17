import fastify from 'fastify';
import helmet from 'fastify-helmet';
import formBody from 'fastify-formbody';
import multipart from 'fastify-multipart';

import { RAPORT_SCREENSHOT_MAX_SIZE, SERVICE_PORT } from './constants/config';
import { MailService } from './mail-service';
import api from './api';

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
  MailService.instance.init();

  app.listen(SERVICE_PORT, async () => {
    console.log(`[Bug Reports]: listening on port ${SERVICE_PORT}!`);
  });
};

main();
