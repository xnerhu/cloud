import { FastifyInstance } from 'fastify';

import { ErrorHandler } from './error-handler';

export const handleFastifyErrors = (
  app: FastifyInstance,
  errorHandler: ErrorHandler,
) => {
  app.setErrorHandler((err, req, res) => {
    if (errorHandler.handle(err, res.statusCode)) {
      res.send({ success: false, error: err.message });
    }
  });
};
