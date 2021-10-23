import { FastifyReply } from "fastify";
import { Catch, ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { NotFoundError } from "@mikro-orm/core";

@Catch()
export class MikroOrmExceptionHandler extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<FastifyReply>();

    if (error instanceof NotFoundError) {
      res.status(404).send({
        success: false,
        statusCode: 404,
        error: error.message.split(" ")[0] + " not found",
      });
    } else {
      return super.catch(error, host);
    }
  }
}
