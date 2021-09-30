import Joi from "joi";

export const SCHEMA_ENV = Joi.object({
  PORT: Joi.number().default(8000),
  UPDATES_PUBLIC_PATH: Joi.string().default("/updates"),
  API_KEY: Joi.string().default("default"),
});
