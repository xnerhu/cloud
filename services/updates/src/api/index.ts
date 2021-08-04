import { FastifyInstance, FastifyRequest } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { ServiceLogger } from '@services/common';

import { App } from '../app';
import upload from './upload';

const SCHEMA_INDEX = {
  type: 'object',
  properties: {
    browserVersion: { type: 'string' },
  },
} as const;

type IndexRequest = FastifyRequest<{
  Querystring: FromSchema<typeof SCHEMA_INDEX>;
}>;

export default (app: FastifyInstance, logger: ServiceLogger) => {
  upload(app, logger);

  app.get(
    '/',
    { schema: { querystring: SCHEMA_INDEX } },
    async (req: IndexRequest) => {
      const { type, patches, fullFile } =
        await App.instance.releaseStorage.getUpdate(req.query.browserVersion);

      return { success: true, type, patches, fullFile };
    },
  );
};
