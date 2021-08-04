import { FastifyInstance } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import {
  ensureFileFormat,
  FastifyBodyFile,
  getBodyFile,
  ServiceLogger,
} from '@services/common';

import { API_KEY } from '../constants';
import { IncorrectApiKey } from './errors';
import { App } from '../app';

const SCHEMA_UPLOAD = {
  type: 'object',
  required: ['apiKey', 'patch', 'full', 'version', 'patchHash', 'fullHash'],
  properties: {
    apiKey: { type: 'string' },
    version: { type: 'string' },
    patchHash: { type: 'string' },
    fullHash: { type: 'string' },
  },
} as const;

type UploadRequestBodyParams = FromSchema<typeof SCHEMA_UPLOAD> & {
  patch: FastifyBodyFile;
  full: FastifyBodyFile;
};

export default (server: FastifyInstance, logger: ServiceLogger) => {
  server.put<{ Body: UploadRequestBodyParams }>(
    '/upload',
    { schema: { body: SCHEMA_UPLOAD } },
    async (req, res) => {
      const { apiKey, patch, full, version, fullHash, patchHash } = req.body;

      if (apiKey !== API_KEY) throw IncorrectApiKey();

      const patchFile = getBodyFile(patch);
      const fullFile = getBodyFile(full);

      ensureFileFormat(patchFile.filename, 'patch');
      ensureFileFormat(fullFile.filename, 'packed.7z');

      await App.instance.releaseController.insert({
        patch: patchFile.data,
        full: fullFile.data,
        version,
        fullHash,
        patchHash,
      });

      return { success: true };
    },
  );
};
