import { FastifyInstance } from 'fastify';

import { ErrorHandler } from '../errors/error-handler';

export const handleFastifyErrors = (
  app: FastifyInstance,
  errorHandler: ErrorHandler,
) => {
  app.setErrorHandler((err, req, res) => {
    res.statusCode = errorHandler.getStatusCode(err) || res.statusCode;

    if (errorHandler.handle(err, res.statusCode)) {
      res.send({ success: false, error: err.message });
    }
  });
};
