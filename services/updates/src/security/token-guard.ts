import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FastifyRequest } from "fastify";
import { IS_TEST } from "@common/node";

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  private getAccessToken() {
    if (IS_TEST) return "TEST_TOKEN";
    return this.configService.get<string>("API_KEY");
  }

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    const token = req.headers.authorization;

    const apiKey = this.getAccessToken();

    return token === apiKey;
  }
}
