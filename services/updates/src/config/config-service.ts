import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { IS_TEST } from "@common/node";

import { TEST_UPDATES_PATH } from "./env";

@Injectable()
export class ConfigService {
  constructor(private readonly env: NestConfigService) {}

  public get updatesPublicPath() {
    return this.env.get<string>("UPDATES_PUBLIC_PATH")!;
  }

  public get updatesPath() {
    if (IS_TEST) return TEST_UPDATES_PATH!;
    return this.env.get<string>("UPDATES_PATH")!;
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
