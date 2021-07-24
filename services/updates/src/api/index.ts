import { FastifyInstance, FastifyRequest } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

import { App } from '../app';

const SCHEMA_INDEX = {
  type: 'object',
  required: ['browserVersion'],
  properties: {
    browserVersion: { type: 'string' },
  },
} as const;

type IndexRequest = FastifyRequest<{
  Querystring: FromSchema<typeof SCHEMA_INDEX>;
}>;

export default (app: FastifyInstance) => {
  app.get(
    '/v1/',
    { schema: { querystring: SCHEMA_INDEX } },
    async (req: IndexRequest) => {
      const { type, files } = await App.instance.releaseStore.getForVersion(
        req.query.browserVersion,
      );

      return { success: true, type, files };
    },
  );
};
