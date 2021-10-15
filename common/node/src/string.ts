import { randomBytes } from "./crypto";

export const makeId = async (length = 12) => {
  const entropyLength = Math.ceil(length / 2);

  const buffer = await randomBytes(entropyLength);

  const str = buffer.toString("hex");

  return str.slice(0, length);
};
