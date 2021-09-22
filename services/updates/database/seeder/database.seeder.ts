import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { DistributionEntity } from '@common/updates-db';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const distro = em.create(DistributionEntity, {
      architecture: 'x64',
      os: 'windows',
      osVersion: 'any',
    });
  }
}
