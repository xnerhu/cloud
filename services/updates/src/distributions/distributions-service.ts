import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";

import { Distribution } from "../interfaces";
import { DistributionEntity } from "../distributions/distribution-entity";

export type DistributionSearchOptions = Partial<
  Record<
    keyof Pick<Distribution, "os" | "osVersion" | "architecture">,
    string
  > & { id?: number }
>;

export const DEFAULT_DISTRIBUTION_SEARCH_OPTIONS: DistributionSearchOptions = {
  os: "windows",
  osVersion: "any",
  architecture: "x64",
};

@Injectable()
export class DistributionsService {
  constructor(
    @InjectRepository(DistributionEntity)
    private readonly distributionsRepo: EntityRepository<DistributionEntity>,
  ) {}

  public async findOne(options: DistributionSearchOptions) {
    return await this.distributionsRepo.findOne(options);
  }

  public async findOneOrFail(
    options: DistributionSearchOptions,
  ): Promise<DistributionEntity> {
    const distro = await this.findOne(options);

    if (distro == null) {
      throw new NotFoundException("Distribution not found");
    }

    return distro;
  }
}
