import Joi from "joi";

export const SCHEMA_ENV = Joi.object({
  DISCORD_TOKEN: Joi.string().required(),
  UPDATES_CHANNEL: Joi.string().required(),
  DOWNLOAD_URL: Joi.string().required(),
  RMQ_URL: Joi.string().required(),
  RMQ_QUEUE: Joi.string().required(),
});

export const getRMQConfig = () => {
  return {
    url: process.env.RMQ_URL as string,
    queue: process.env.RMQ_QUEUE as string,
  };
};
