import { FastifyInstance } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

import { ReportService } from './report-service';

const SCHEMA_REPORT = {
  type: 'object',
  required: [
    'description',
    'url',
    'chromiumVersion',
    'wexondVersion',
    'userAgent',
  ],
  properties: {
    description: { type: 'string' },
    url: { type: 'string' },
    email: { type: 'string' },
    wexondVersion: { type: 'string' },
    chromiumVersion: { type: 'string' },
    userAgent: { type: 'string' },
  },
} as const;

type ReportBodyParams = FromSchema<typeof SCHEMA_REPORT> & {
  screenshot?: { data: Buffer }[];
};

export default (app: FastifyInstance) => {
  app.post<{ Body: ReportBodyParams }>(
    '/report',
    { schema: { body: SCHEMA_REPORT } },
    async (req, res) => {
      const {
        url,
        description,
        chromiumVersion,
        email,
        userAgent,
        wexondVersion,
      } = req.body;

      await ReportService.instance.report({
        url,
        description,
        chromiumVersion,
        email,
        userAgent,
        wexondVersion,
        screenshot: req.body.screenshot?.[0]?.data,
      });

      return { success: true };
    },
  );
};
