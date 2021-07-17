import { FastifyInstance } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { Logger } from './logger';

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
  screenshot?: { data: Buffer; mimetype: string }[];
};

export default (app: FastifyInstance) => {
  app.post<{ Body: ReportBodyParams }>(
    '/report',
    { schema: { body: SCHEMA_REPORT } },
    async (req, res) => {
      Logger.instance.info(`Incoming report request`);

      const {
        url,
        description,
        chromiumVersion,
        email,
        userAgent,
        wexondVersion,
        screenshot,
      } = req.body;

      if (
        screenshot?.length !== 0 &&
        !screenshot![0].mimetype.startsWith('image')
      ) {
        res.statusCode = 400;

        Logger.instance.info(
          //
          `Incorrect report request with mimetype ${screenshot![0].mimetype}`,
        );

        throw new Error('Screenshot must be an image!');
      }

      await ReportService.instance.report({
        url,
        description,
        chromiumVersion,
        email,
        userAgent,
        wexondVersion,
        screenshot: screenshot?.[0]?.data,
      });

      return { success: true };
    },
  );
};
