import { randomBytes } from "../crypto";

export const makeId = async (length = 12) => {
  const buffer = await randomBytes(length);

  return buffer.toString("hex");
};
