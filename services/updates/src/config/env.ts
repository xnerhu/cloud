import Joi from "joi";
import { config } from "dotenv";
import { resolve } from "path";
import { IS_DEV, IS_TEST } from "@common/node";

export const SCHEMA_ENV = Joi.object({
  PORT: Joi.number().default(80),
  PATCHES_PUBLIC_PATH: Joi.string().required(),
  INSTALLERS_PUBLIC_PATH: Joi.string().required(),
  PATCHES_PATH: Joi.string().required(),
  INSTALLERS_PATH: Joi.string().required(),
  API_KEY: Joi.string().required(),
  RMQ_ENABLED: Joi.boolean().optional().default(true),
  RMQ_URL: Joi.string().required(),
  RMQ_QUEUE: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
});

export const getPostgresConfig = () => {
  if (IS_TEST) {
    config({ path: resolve(__dirname, "../../.test.env") });
  }

  if (IS_DEV) {
    config({ path: resolve(__dirname, "../../.env") });
  }

  return {
    host: process.env.POSTGRES_HOST as string,
    port: parseInt(process.env.POSTGRES_PORT as string),
    dbName: process.env.POSTGRES_DB as string,
    user: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string,
  };
};
