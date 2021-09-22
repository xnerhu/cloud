import { EntityManager, MikroORM } from '@mikro-orm/core';
import { Seeder, Factory } from '@mikro-orm/seeder';
import {
  ReleaseEntity,
  DistributionEntity,
  PatchEntity,
} from '@common/updates-db';

// import { DistributionEntity } from '../src/distributions/distribution-entity';
// import {
//   Distribution,
//   DistributionEntity,
//   Patch,
//   PatchEntity,
//   Release,
//   ReleaseEntity,
// } from '@common/updates-db';

// export class AuthorFactory extends Factory<ReleaseEntity> {
//   model = ReleaseEntity;

//   definition(): Partial<ReleaseEntity> {
//     return {
//       channel: 'alpha',
//       notes: 'xd',
//       tag: '1.0.0',
//     };
//   }
// }
// class DatabaseSeeder extends Seeder {
//   async run(em: EntityManager): Promise<void> {
//     new AuthorFactory(em).createOne();
//   }
// }

const main = async () => {
  console.log('Seeding updates db');

  // const connection = await createConnection({
  //   type: 'postgres',
  //   host: 'localhost',
  //   port: 5432,
  //   database: 'updates',
  //   username: 'root',
  //   password: 'example',
  //   migrationsRun: true,
  //   synchronize: true,
  //   dropSchema: true,
  //   entities: [DistributionEntity, PatchEntity, ReleaseEntity],
  // });

  const connection = await MikroORM.init();

  const windowsDistro = new DistributionEntity();
  const linuxDistro = new DistributionEntity();
  const macosDistro = new DistributionEntity();
  const macosArmDistro = new DistributionEntity();

  {
    windowsDistro.os = 'windows';
    windowsDistro.architecture = 'x64';
    windowsDistro.osVersion = 'any';

    linuxDistro.os = 'linux';
    linuxDistro.architecture = 'x64';
    linuxDistro.osVersion = 'any';

    macosDistro.os = 'macos';
    macosDistro.architecture = 'x64';
    macosDistro.osVersion = 'any';

    macosArmDistro.os = 'macos';
    macosArmDistro.architecture = 'arm';
    macosArmDistro.osVersion = 'any';
  }

  const distroRepo = connection.em.getRepository(DistributionEntity);

  const res = await distroRepo.create([
    windowsDistro,
    linuxDistro,
    macosDistro,
    macosArmDistro,
  ]);

  // console.log(await distroRepo.findAll());

  // const releases: (Omit<Release, 'id' | 'patches'> & {
  //   patches: (Omit<Patch, 'id' | 'distribution'> & {
  //     distribution: DistributionEntity;
  //   })[];
  // })[] = [
  //   {
  //     tag: '2.0.0',
  //     notes: 'first-release',
  //     channel: 'stable',
  //     patches: [
  //       {
  //         hash: 'fourth-2.0.0-patch',
  //         size: 11663861,
  //         fullHash: 'windows-2.0.0-full',
  //         fullSize: 61212089,
  //         distribution: windowsDistro,
  //       },
  //       {
  //         hash: 'macos-2.0.0-patch',
  //         size: 16663861,
  //         fullHash: 'macos-2.0.0-full',
  //         fullSize: 71212089,
  //         distribution: macosDistro,
  //       },
  //     ],
  //   },
  //   {
  //     tag: '1.2.0',
  //     notes: 'first-release',
  //     channel: 'stable',
  //     patches: [
  //       {
  //         hash: 'third-1.2.0-patch',
  //         size: 11663861,
  //         fullHash: 'windows-1.2.0-full',
  //         fullSize: 61212089,
  //         distribution: windowsDistro,
  //       },
  //       {
  //         hash: 'macos-1.2.0-patch',
  //         size: 16663861,
  //         fullHash: 'macos-1.2.0-full',
  //         fullSize: 71212089,
  //         distribution: macosDistro,
  //       },
  //       {
  //         hash: 'linux-1.2.0-patch',
  //         size: 16663861,
  //         fullHash: 'linux-1.2.0-full',
  //         fullSize: 71212089,
  //         distribution: linuxDistro,
  //       },
  //     ],
  //   },
  //   {
  //     tag: '1.1.0',
  //     notes: 'second-release',
  //     channel: 'stable',
  //     patches: [
  //       {
  //         hash: 'windows-1.1.0-patch',
  //         size: 11663861,
  //         fullHash: 'windows-1.1.0-full',
  //         fullSize: 61212089,
  //         distribution: windowsDistro,
  //       },
  //       {
  //         hash: 'macos-1.1.0-patch',
  //         size: 16663861,
  //         fullHash: 'macos-1.1.0-full',
  //         fullSize: 71212089,
  //         distribution: macosDistro,
  //       },
  //     ],
  //   },
  //   {
  //     tag: '1.0.0',
  //     notes: 'first-release',
  //     channel: 'stable',
  //     patches: [
  //       {
  //         hash: 'windows-1.0.0-patch',
  //         size: 11663861,
  //         fullHash: 'windows-1.0.0-full',
  //         fullSize: 61212089,
  //         distribution: windowsDistro,
  //       },
  //       {
  //         hash: 'macos-1.0.0-patch',
  //         size: 16663861,
  //         fullHash: 'macos-1.0.0-full',
  //         fullSize: 71212089,
  //         distribution: macosDistro,
  //       },
  //       {
  //         hash: 'linux-1.0.0-patch',
  //         size: 16663861,
  //         fullHash: 'linux-1.0.0-full',
  //         fullSize: 71212089,
  //         distribution: linuxDistro,
  //       },
  //     ],
  //   },
  // ];

  // const patchRepo = connection.getRepository(PatchEntity);
  // const releaseRepo = connection.getRepository(ReleaseEntity);

  // for (const release of releases) {
  //   const releaseEntity = new ReleaseEntity();

  //   const patches = await Promise.all(
  //     release.patches.map(async (patch) => {
  //       const patchEntity = new PatchEntity();

  //       patchEntity.hash = patch.hash;
  //       patchEntity.size = patch.size;
  //       patchEntity.fullHash = patch.fullHash;
  //       patchEntity.fullSize = patch.fullSize;
  //       patchEntity.distribution = patch.distribution;

  //       await patchRepo.save(patchEntity);

  //       return patchEntity;
  //     }),
  //   );

  //   releaseEntity.channel = release.channel;
  //   releaseEntity.tag = release.tag;
  //   releaseEntity.notes = release.notes;
  //   releaseEntity.patches = patches;

  //   await releaseRepo.save(releaseEntity);
  // }

  await connection.close();
};

main();
