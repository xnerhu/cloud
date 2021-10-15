import Joi from "joi";
import { resolve } from "path";
import { IS_TEST } from "@common/node";

export const SCHEMA_ENV = Joi.object({
  PORT: Joi.number().default(8000),
  UPDATES_PUBLIC_PATH: Joi.string().required(),
  API_KEY: Joi.string().required(),
  RMQ_ENABLED: Joi.boolean().optional().default(true),
  RMQ_URL: Joi.string().required(),
  RMQ_QUEUE: Joi.string().required(),
});

export const TEST_UPDATES_PATH = IS_TEST
  ? resolve(__dirname, "uploads")
  : undefined;
