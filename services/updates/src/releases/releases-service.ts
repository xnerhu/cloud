import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";

import { ReleaseEntity } from "./release-entity";

export interface ReleaseSearchOptions {
  version: string;
  channel: string;
}

export interface ReleaseCreateOptions {
  version: string;
  channel: string;
  notes?: string;
}

export interface ReleaseFindBeforeOptions {
  version: string;
  channel: string;
}

@Injectable()
export class ReleasesService {
  constructor(
    @InjectRepository(ReleaseEntity)
    private readonly releasesRepo: EntityRepository<ReleaseEntity>,
  ) {}

  public async findOne({ channel, version }: ReleaseSearchOptions) {
    return await this.releasesRepo.findOne({ channel, version });
  }

  public async createOne({ channel, version, notes }: ReleaseCreateOptions) {
    const release = new ReleaseEntity();

    release.channel = channel;
    release.version = version;
    release.notes = notes || "";

    await this.releasesRepo.persistAndFlush(release);

    return release;
  }

  public async findOneBefore({ channel, version }: ReleaseFindBeforeOptions) {
    return await this.releasesRepo.findOne(
      {
        channel,
        version: { $lt: version },
      },
      { orderBy: { version: "DESC" } },
    );
  }
}
