import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";

import { ReleaseEntity } from "./release-entity";

export type ReleaseSearchOptions =
  | {
      version: string;
      channel: string;
    }
  | { id?: number };

export interface ReleaseCreateOptions {
  version: string;
  channel: string;
  notes?: string;
}

export interface ReleaseFindBeforeOptions {
  version: string;
  channel: string;
}

export interface ReleaseFindLatestOptions {
  channel: string;
}

@Injectable()
export class ReleasesService {
  constructor(
    @InjectRepository(ReleaseEntity)
    private readonly releasesRepo: EntityRepository<ReleaseEntity>,
  ) {}

  public async findOne(options: ReleaseSearchOptions) {
    return await this.releasesRepo.findOne(options);
  }

  public async findLatest(options: ReleaseFindLatestOptions) {
    return await this.releasesRepo.findOne({ channel: options.channel });
  }

  public async findOneOrFail(
    options: ReleaseSearchOptions,
  ): Promise<ReleaseEntity> {
    const release = await this.findOne(options);

    if (!release) {
      throw new NotFoundException("Release not found");
    }

    return release;
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
