import { MultipartFile as _MultipartFile } from "fastify-multipart";
import { Readable } from "stream";

export interface MultipartField {
  /**
   * Field name
   */
  name: string;
  /**
   * Max number of files in this field
   */
  maxCount?: number;
}

export type MultipartFile = Omit<_MultipartFile, "file"> & {
  value?: any;
  file: Readable & { truncated?: boolean };
};
