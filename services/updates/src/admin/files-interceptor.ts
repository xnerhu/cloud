import { pump } from "@common/node";
import {
  BadGatewayException,
  PayloadTooLargeException,
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Optional,
  Type,
  BadRequestException,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { createWriteStream } from "fs";
import { extname, resolve } from "path";
import { catchError, Observable, throwError } from "rxjs";

export type FileInterceptorOptions = busboy.BusboyConfig &
  (
    | {
        saveToDisk?: false;
      }
    | {
        saveToDisk?: true;
        /**
         * Modifies filename to be unique
         */
        unique?: boolean;
        /**
         * Directory where to save files
         */
        savePath?: string;
        /**
         * Deletes files when request is finished
         */
        deleteAfter?: boolean;
      }
  );

const HASH_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const makeId = (length = 12) => {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += HASH_CHARACTERS.charAt(
      Math.floor(Math.random() * HASH_CHARACTERS.length),
    );
  }

  return result;
};

export function FilesInterceptor(
  fieldName: string,
  localOptions?: FileInterceptorOptions,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      const req = ctx.getRequest<FastifyRequest>();

      if (!req.isMultipart()) {
        throw new BadRequestException();
      }

      const body: Record<string, any> = {};

      const parts = req.parts(localOptions);

      for await (const part of parts) {
        if (part.file) {
          // let filename = part.filename;
          // if (localOptions?.unique) {
          //   filename = makeId() + extname(filename);
          // }
          // const savePath = resolve(localOptions?.savePath || "", filename);
          // const buffer = await part.toBuffer();
          // console.log(buffer.byteLength);
          // await pump(part.file, createWriteStream(savePath));
          // if ((part.file as any).truncated) {
          //   throw new PayloadTooLargeException();
          // }
        } else {
          body[part.fieldname] = (part as any).value;
        }
      }

      req.body = body;

      return next.handle();
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
}
