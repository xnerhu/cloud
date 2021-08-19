// import fastify from 'fastify';
// import helmet from 'fastify-helmet';
// import formBody from 'fastify-formbody';
// import multipart from 'fastify-multipart';
// import { ensurePath } from '@services/common';

// import { FEEDBACK_SCREENSHOT_MAX_SIZE, SERVICE_PORT } from './constants/config';
// import { MailService } from './mail-service';
// import api from './api';
// import { PATH_OUT } from './constants/paths';
// import { Logger } from './logger';

// const app = fastify();

// app.register(helmet);
// app.register(formBody);
// app.register(multipart, {
//   limits: {
//     fieldNameSize: 100,
//     fieldSize: 100,
//     fields: 10,
//     fileSize: FEEDBACK_SCREENSHOT_MAX_SIZE,
//     files: 5,
//     headerPairs: 2000,
//   },
//   addToBody: true,
//   attachFieldsToBody: true,
// });

// app.setErrorHandler((err, req, res) => {
//   Logger.instance.error(`Internal error: ${err.message}, ${err.stack}`);
// });

// api(app);

// const main = async () => {
//   await ensurePath(PATH_OUT);

//   MailService.instance.init();

//   app.listen(SERVICE_PORT, async () => {
//     Logger.instance.info(`Listening on port ${SERVICE_PORT}!`);
//   });
// };

// process.on('uncaughtException', (err) => {
//   Logger.instance.warn(`Uncaught Exception: ${err.message}`);
// });

// process.on('unhandledRejection', (err) => {
//   Logger.instance.warn(`Unhandled Rejection: ${err}`);
// });

// main();

import { handleNodeErrors } from '@services/common';

import { App } from './app';

handleNodeErrors(App.instance.logger);
App.instance.init();
