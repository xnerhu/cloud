import { FastifyInstance } from 'fastify';

import { ErrorHandler } from '@common/node';

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
