export interface FastifyFile {
  data: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
  limit: boolean;
}

export type FastifyBodyFile = FastifyFile[];

export const getBodyFile = (param: FastifyFile | FastifyFile[]) => {
  if (param instanceof Array) return param[0];
  return param;
};
