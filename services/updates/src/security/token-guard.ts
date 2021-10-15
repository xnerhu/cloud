import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FastifyRequest } from "fastify";

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    const token = req.headers.authorization;

    const apiKey = this.configService.get<string>("API_KEY");

    return token === apiKey;
  }
}
