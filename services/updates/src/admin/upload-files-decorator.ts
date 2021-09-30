import { createWriteStream } from "fs";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { pump } from "@common/node";

export const UploadFiles = createParamDecorator(
  async (data: busboy.BusboyConfig, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    const parts = req.parts(data);

    // const fieldMap = new Map<string, any>();

    for await (const part of parts) {
      if (part.file) {
        // console.log("File" + part.filename);
        await pump(part.file, createWriteStream(part.filename));
      } else {
        // fieldMap.set(
      }
    }

    // return request.user;
    // console.log(request);
    return "xdd";
  },
);
