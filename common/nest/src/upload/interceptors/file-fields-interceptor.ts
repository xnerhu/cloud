import { Observable, tap } from "rxjs";
import {
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Type,
  BadRequestException,
  SetMetadata,
} from "@nestjs/common";
import { MultipartField, MultipartFile } from "../multipart-options";
import { transformUploadOptions, UploadOptions } from "../options";
import { getMultipartRequest } from "../request";
import { StorageFile } from "../storage";

type UploadFieldMapEntry = Required<Pick<MultipartField, "maxCount">>;

const uploadFieldsToMap = (uploadFields: MultipartField[]) => {
  const map = new Map<string, UploadFieldMapEntry>();

  uploadFields.forEach(({ name, ...opts }) => {
    map.set(name, { maxCount: 1, ...opts });
  });

  return map;
};

export function FileFieldsInterceptor(
  uploadFields: MultipartField[],
  options?: UploadOptions,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    private readonly options: UploadOptions;

    private readonly fieldsMap: Map<string, UploadFieldMapEntry>;

    constructor() {
      this.options = transformUploadOptions(options);
      this.fieldsMap = uploadFieldsToMap(uploadFields);
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

      const files: Record<string, StorageFile[]> = {};

      for await (const part of parts) {
        if (part.file) {
          const fieldOptions = this.fieldsMap.get(part.fieldname);

          if (fieldOptions == null) {
            throw new BadRequestException(
              `Field ${part.fieldname} is not allowed to have files`,
            );
          }

          if (files[part.fieldname] == null) {
            files[part.fieldname] = [];
          }

          if (files[part.fieldname].length + 1 > fieldOptions.maxCount) {
            throw new BadRequestException(
              `Field ${part.fieldname} allows only ${fieldOptions.maxCount} files`,
            );
          }

          files[part.fieldname].push(
            await this.options.storage!.handleFile(part, req),
          );
        } else {
          body[part.fieldname] = part.value;
        }
      }

      const fields = Array.from(this.fieldsMap.keys());
      const providedFields = Object.keys(files);

      for (const field of fields) {
        if (!providedFields.includes(field)) {
          throw new BadRequestException(`Field ${field} is required`);
        }
      }

      req.body = body;
      req.storageFiles = files;

      return next.handle().pipe(
        tap(async () => {
          const allFiles = ([] as StorageFile[]).concat(
            ...Object.values(files),
          );

          return await Promise.all(
            allFiles.map((file) => this.options.storage!.removeFile(file)),
          );
        }),
      );
    }
  }

  const Interceptor = mixin(MixinInterceptor);

  return Interceptor;
}
