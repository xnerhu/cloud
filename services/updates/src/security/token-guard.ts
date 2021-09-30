import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { TOKEN_EXCEPTION_METADATA_KEY } from "./token-exception";

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const allow = this.reflector.get<boolean>(
      TOKEN_EXCEPTION_METADATA_KEY,
      ctx.getHandler(),
    );

    if (allow) return true;

    const apiKey = this.configService.get<string>("API_KEY");

    const req = ctx.switchToHttp().getRequest();
    const token =
      /*req.body?.token?.value ??*/ req.body?.token ?? req.query?.token;

    return token === apiKey;
  }
}
