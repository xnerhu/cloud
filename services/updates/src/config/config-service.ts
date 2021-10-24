import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { ensureDir, normalizePath } from "@common/node";

@Injectable()
export class ConfigService {
  constructor(private readonly env: NestConfigService) {}

  public async init() {
    await ensureDir(this.patchesPath, this.installersPath);
  }

  public get port() {
    return this.env.get("PORT", { infer: true }) as number;
  }

  public get patchesPublicPath() {
    return this.env.get<string>("PATCHES_PUBLIC_PATH")!;
  }

  public get installersPublicPath() {
    return this.env.get<string>("INSTALLERS_PUBLIC_PATH")!;
  }

  public get patchesPath() {
    return normalizePath(this.env.get<string>("PATCHES_PATH")!);
  }

  public get installersPath() {
    return normalizePath(this.env.get<string>("INSTALLERS_PATH")!);
  }

  public get apiKey() {
    return this.env.get<string>("API_KEY")!;
  }

  public get isRMQEnabled() {
    return this.env.get<boolean>("RMQ_ENABLED", { infer: true })!;
  }

  public get rmqUrl() {
    return this.env.get<string>("RMQ_URL")!;
  }

  public get rmqQueue() {
    return this.env.get<string>("RMQ_QUEUE")!;
  }
}
