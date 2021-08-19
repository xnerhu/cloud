import { FastifyInstance } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { ServiceLogger } from '@backend/common';

import {
  FEEDBACK_ATTACHMENTS_MAX_NUMBER,
  FEEDBACK_ATTACHMENTS_MAX_SIZE,
} from '../constants';
import { FeedbackService } from '../feedback-service';
import {
  AttachmentMimeTypeError,
  AttachmentsLimitError,
  AttachmentsSizeLimitError,
} from './errors';

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

export default (
  server: FastifyInstance,
  feedbackService: FeedbackService,
  logger: ServiceLogger,
) => {
  server.post<{ Body: FeedbackRequestBodyParams }>(
    '/',
    { schema: { body: SCHEMA_FEEDBACK } },
    async (req, res) => {
      logger.info(`Incoming feedback request`);

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

      if (attachments != null && attachments instanceof Array) {
        if (attachments.length > FEEDBACK_ATTACHMENTS_MAX_NUMBER) {
          throw AttachmentsLimitError();
        }

        const allSize = attachments.reduce(
          (sum, r) => sum + r.data.byteLength,
          0,
        );

        if (allSize > FEEDBACK_ATTACHMENTS_MAX_SIZE) {
          throw AttachmentsSizeLimitError();
        }

        for (const file of attachments) {
          if (!file.mimetype.startsWith('image')) {
            throw AttachmentMimeTypeError();
          }
        }
      }

      await feedbackService.report({
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
