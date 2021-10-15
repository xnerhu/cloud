import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { FastifyRequest } from "fastify";

import { ConfigService } from "../config/config-service";

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    const token = req.headers.authorization;

    return token === this.configService.apiKey;
  }
}
