import { Observable } from "rxjs";
import {
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Type,
} from "@nestjs/common";
import { MultipartFile } from "../multipart-options";
import { transformUploadOptions, UploadOptions } from "../options";
import { getMultipartRequest } from "../request";
import { StorageFile } from "../storage";

export function AnyFilesInterceptor(
  options?: UploadOptions,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    private readonly options: UploadOptions;

    constructor() {
      this.options = transformUploadOptions(options);
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();
      const req = getMultipartRequest(ctx);

      const body: Record<string, any> = {};

      const parts = req.parts(
        this.options,
      ) as AsyncIterableIterator<MultipartFile>;

      const files: StorageFile[] = [];

      for await (const part of parts) {
        if (part.file) {
          files.push(await this.options.storage!.handleFile(part, req));
        } else {
          body[part.fieldname] = part.value;
        }
      }

      req.body = body;
      req.storageFiles = files;

      return next.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);

  return Interceptor;
}
