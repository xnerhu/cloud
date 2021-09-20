import { createConnection } from 'typeorm';
import {
  Distribution,
  DistributionEntity,
  Patch,
  PatchEntity,
  Release,
  ReleaseEntity,
} from '@common/updates-db';

const main = async () => {
  console.log('Seeding updates db');

  const connection = await createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'updates',
    username: 'root',
    password: 'example',
    migrationsRun: true,
    synchronize: true,
    dropSchema: true,
    entities: [DistributionEntity, PatchEntity, ReleaseEntity],
  });

  const windowsDistro = new DistributionEntity();
  const linuxDistro = new DistributionEntity();
  const macosDistro = new DistributionEntity();
  const macosArmDistro = new DistributionEntity();

  {
    windowsDistro.platform = 'windows';
    windowsDistro.architecture = 'x64';
    windowsDistro.osVersion = 'any';

    linuxDistro.platform = 'linux';
    linuxDistro.architecture = 'x64';
    linuxDistro.osVersion = 'any';

    macosDistro.platform = 'macos';
    macosDistro.architecture = 'x64';
    macosDistro.osVersion = 'any';

    macosArmDistro.platform = 'macos';
    macosArmDistro.architecture = 'arm';
    macosArmDistro.osVersion = 'any';
  }

  const distroRepo = connection.getRepository(DistributionEntity);

  await distroRepo.insert([
    windowsDistro,
    linuxDistro,
    macosDistro,
    macosArmDistro,
  ]);

  const releases: (Omit<Release, 'id' | 'patches'> & {
    patches: (Omit<Patch, 'id' | 'distribution'> & {
      distribution: DistributionEntity;
    })[];
  })[] = [
    {
      tag: '1.0.0',
      notes: 'first-release',
      patches: [
        {
          hash: 'windows-1.0.0-patch',
          size: 11663861,
          fullHash: 'windows-1.0.0-full',
          fullSize: 61212089,
          distribution: windowsDistro,
        },
        {
          hash: 'macos-1.0.0-patch',
          size: 16663861,
          fullHash: 'macos-1.0.0-full',
          fullSize: 71212089,
          distribution: macosDistro,
        },
      ],
    },
  ];

  const patchRepo = connection.getRepository(PatchEntity);
  const releaseRepo = connection.getRepository(ReleaseEntity);

  for (const release of releases) {
    const releaseEntity = new ReleaseEntity();

    const patches = await Promise.all(
      release.patches.map(async (patch) => {
        const patchEntity = new PatchEntity();

        patchEntity.hash = patch.hash;
        patchEntity.size = patch.size;
        patchEntity.fullHash = patch.fullHash;
        patchEntity.fullSize = patch.fullSize;
        patchEntity.distribution = patch.distribution;

        await patchRepo.save(patchEntity);

        return patchEntity;
      }),
    );

    releaseEntity.tag = release.tag;
    releaseEntity.notes = release.notes;
    releaseEntity.patches = patches;

    await releaseRepo.save(releaseEntity);
  }
};

main();
