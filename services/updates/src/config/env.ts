import Joi from 'joi';

export const SCHEMA_ENV = Joi.object({
  PORT: Joi.number().default(8000),
  UPDATES_FILES_PUBLIC_PATH: Joi.string(),
});
