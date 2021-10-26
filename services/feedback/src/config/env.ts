import Joi from "joi";

export const SCHEMA_ENV = Joi.object({
  PORT: Joi.number().default(8080),
  JIRA_HOST: Joi.string().required(),
  JIRA_PROJECT_KEY: Joi.string().required(),
  JIRA_USERNAME: Joi.string().required(),
  JIRA_PASSWORD: Joi.string().required(),
  MAX_ATTACHMENT_SIZE: Joi.number().required(),
  ATTACHMENTS_PATH: Joi.string().required(),
  ATTACHMENTS_URL: Joi.string().required(),
  API_KEY: Joi.string().required(),
  RMQ_ENABLED: Joi.boolean().optional().default(true),
  RMQ_URL: Joi.string().required(),
  RMQ_QUEUE: Joi.string().required(),
});

export const ENV_MAX_ATTACHMENT_SIZE = parseInt(
  process.env.MAX_ATTACHMENT_SIZE as string,
);
