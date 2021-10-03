import Joi from "joi";
import { resolve } from "path";
import { IS_TEST } from "@common/node";

export const SCHEMA_ENV = Joi.object({
  PORT: Joi.number().default(8000),
  UPDATES_PUBLIC_PATH: Joi.string().default("/updates"),
  API_KEY: Joi.string().default("default"),
});

export const TEST_UPDATES_PATH = IS_TEST
  ? resolve(__dirname, "uploads")
  : undefined;
