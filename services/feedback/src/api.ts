import { FastifyInstance } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

import { FeedbackService } from './feedback-service';
import { Logger } from './logger';

const SCHEMA_FEEDBACK = {
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
    diagnosticData: { type: 'string' },
  },
} as const;

type FeedbackRequestBodyParams = FromSchema<typeof SCHEMA_FEEDBACK> & {
  attachments?: { data: Buffer; mimetype: string }[];
};

export default (app: FastifyInstance) => {
  app.post<{ Body: FeedbackRequestBodyParams }>(
    '/feedback',
    { schema: { body: SCHEMA_FEEDBACK } },
    async (req, res) => {
      Logger.instance.info(`Incoming feedback request`);

      const {
        url,
        description,
        chromiumVersion,
        email,
        userAgent,
        wexondVersion,
        attachments,
        diagnosticData,
      } = req.body;

      if (
        attachments != null &&
        attachments.length > 0 &&
        !attachments[0].mimetype.startsWith('image')
      ) {
        res.statusCode = 400;

        Logger.instance.info(
          `Incorrect feedback request with mimetype ${
            attachments![0].mimetype
          }`,
        );

        throw new Error('Screenshot must be an image!');
      }

      await FeedbackService.instance.report({
        url,
        description,
        chromiumVersion,
        email,
        userAgent,
        wexondVersion,
        attachments: attachments?.map((r) => r.data),
        diagnosticData,
      });

      return { success: true };
    },
  );
};
