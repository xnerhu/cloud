import Joi from "joi";

export const SCHEMA_ENV = Joi.object({
  RMQ_URL: Joi.string().required(),
  RMQ_QUEUE: Joi.string().required(),
  DISCORD_TOKEN: Joi.string().required(),
  DISCORD_CHANNEL: Joi.string().required(),
});

export const getRMQConfig = () => {
  const config = {
    url: process.env.RMQ_URL as string,
    queue: process.env.RMQ_QUEUE as string,
  };

  if (Object.values(config).find((r) => !r)) {
    throw new Error("Invalid env config for RMQ");
  }

  return config;
};
