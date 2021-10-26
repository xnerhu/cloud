import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

@Injectable()
export class ConfigService {
  constructor(private readonly env: NestConfigService) {}

  public get discordToken() {
    return this.env.get<string>("DISCORD_TOKEN")!;
  }

  public get updatesChannel() {
    return this.env.get<string>("UPDATES_CHANNEL")!;
  }

  public get downloadUrl() {
    return this.env.get<string>("DOWNLOAD_URL")!;
  }
}
