import Joi from "joi";

export const SCHEMA_ENV = Joi.object({
  PORT: Joi.number().default(8000),
  PATCHES_PUBLIC_PATH: Joi.string().required(),
  INSTALLERS_PUBLIC_PATH: Joi.string().required(),
  PATCHES_PATH: Joi.string().required(),
  INSTALLERS_PATH: Joi.string().required(),
  API_KEY: Joi.string().required(),
  RMQ_ENABLED: Joi.boolean().optional().default(true),
  RMQ_URL: Joi.string().required(),
  RMQ_QUEUE: Joi.string().required(),
});
