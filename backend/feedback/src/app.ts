import fastify, { FastifyInstance } from 'fastify';
import helmet from 'fastify-helmet';
import formBody from 'fastify-formbody';
import { resolve } from 'path';
import multipart from 'fastify-multipart';
import {
  ServiceLogger,
  ErrorHandler,
  handleFastifyErrors,
} from '@backend/common';

import { SERVICE_PORT } from './constants';
import api from './api';
import { MailService } from './mail/mail-service';
import { FeedbackService } from './feedback-service';

export class App {
  public static instance = new App();

  public logger = new ServiceLogger('Feedback', resolve('out/logs.log'));

  public server: FastifyInstance;

  public mailService = new MailService(this.logger);

  public feedbackService = new FeedbackService(this.mailService);

  public errorHandler = new ErrorHandler(this.logger);

  public async init() {
    this.mailService.init();

    const server = fastify();

    server.register(helmet);
    server.register(multipart, {
      attachFieldsToBody: true,
      addToBody: true,
    });
    server.register(formBody);

    handleFastifyErrors(server, this.errorHandler);
    api(server, this.feedbackService, this.logger);

    server.listen(SERVICE_PORT, async () => {
      this.logger.info(`Listening on port ${SERVICE_PORT}!`);
    });

    this.server = server;
  }
}
