import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

@Injectable()
export class ConfigService {
  constructor(private readonly env: NestConfigService) {}

  public get discordChannel() {
    return this.env.get<string>("DISCORD_CHANNEL")!;
  }

  public get discordToken() {
    return this.env.get<string>("DISCORD_TOKEN")!;
  }
}
