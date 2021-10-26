import { FastifyReply } from "fastify";
import { Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { AppError, handleError } from "@common/node";

@Catch()
export class HttpExceptionHandler extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<FastifyReply>();

    const delegate =
      error instanceof HttpException || !(error instanceof AppError);

    if (delegate) {
      return super.catch(error, host);
    }

    if (handleError(error)) {
      const status = (error as AppError).details.code as number;

      res
        .status(status)
        .send({ success: false, statusCode: status, error: error.message });
    }
  }
}
