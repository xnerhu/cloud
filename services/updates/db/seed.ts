// import { MikroORM } from "@mikro-orm/core";

// import { DistributionEntity } from "../src/distributions/distribution-entity";
// import { Patch, Release } from "../src/interfaces";
// import config from "../src/mikro-orm-config";
// import { PatchEntity } from "../src/patches/patch-entity";
// import { ReleaseEntity } from "../src/releases/release-entity";

// const main = async () => {
//   console.log("Seeding updates db");

//   const connection = await MikroORM.init(config);

//   const windowsDistro = new DistributionEntity();
//   const linuxDistro = new DistributionEntity();
//   const macosDistro = new DistributionEntity();
//   const macosArmDistro = new DistributionEntity();

//   {
//     windowsDistro.os = "windows";
//     windowsDistro.architecture = "x64";
//     windowsDistro.osVersion = "any";

//     linuxDistro.os = "linux";
//     linuxDistro.architecture = "x64";
//     linuxDistro.osVersion = "any";

//     macosDistro.os = "macos";
//     macosDistro.architecture = "x64";
//     macosDistro.osVersion = "any";

//     macosArmDistro.os = "macos";
//     macosArmDistro.architecture = "arm";
//     macosArmDistro.osVersion = "any";
//   }

//   const distroRepo = connection.em.getRepository(DistributionEntity);

//   await distroRepo.persistAndFlush([
//     windowsDistro,
//     linuxDistro,
//     macosDistro,
//     macosArmDistro,
//   ]);

//   const releases: (Omit<Release, "id" | "patches"> & {
//     patches: (Omit<Patch, "id" | "distribution"> & {
//       distribution: DistributionEntity;
//     })[];
//   })[] = [
//     {
//       version: "2.0.0",
//       notes: "first-release",
//       channel: "stable",
//       patches: [
//         {
//           hash: "fourth-2.0.0-patch",
//           size: 11663861,
//           fullHash: "windows-2.0.0-full",
//           fullSize: 61212089,
//           distribution: windowsDistro,
//         },
//         {
//           hash: "macos-2.0.0-patch",
//           size: 16663861,
//           fullHash: "macos-2.0.0-full",
//           fullSize: 71212089,
//           distribution: macosDistro,
//         },
//       ],
//     },
//     {
//       version: "1.2.0",
//       notes: "first-release",
//       channel: "stable",
//       patches: [
//         {
//           hash: "third-1.2.0-patch",
//           size: 11663861,
//           fullHash: "windows-1.2.0-full",
//           fullSize: 61212089,
//           distribution: windowsDistro,
//         },
//         {
//           hash: "macos-1.2.0-patch",
//           size: 16663861,
//           fullHash: "macos-1.2.0-full",
//           fullSize: 71212089,
//           distribution: macosDistro,
//         },
//         {
//           hash: "linux-1.2.0-patch",
//           size: 16663861,
//           fullHash: "linux-1.2.0-full",
//           fullSize: 71212089,
//           distribution: linuxDistro,
//         },
//       ],
//     },
//     {
//       version: "1.1.0",
//       notes: "second-release",
//       channel: "stable",
//       patches: [
//         {
//           hash: "windows-1.1.0-patch",
//           size: 11663861,
//           fullHash: "windows-1.1.0-full",
//           fullSize: 61212089,
//           distribution: windowsDistro,
//         },
//         {
//           hash: "macos-1.1.0-patch",
//           size: 16663861,
//           fullHash: "macos-1.1.0-full",
//           fullSize: 71212089,
//           distribution: macosDistro,
//         },
//       ],
//     },
//     {
//       version: "1.0.0",
//       notes: "first-release",
//       channel: "stable",
//       patches: [
//         {
//           hash: "windows-1.0.0-patch",
//           size: 11663861,
//           fullHash: "windows-1.0.0-full",
//           fullSize: 61212089,
//           distribution: windowsDistro,
//         },
//         {
//           hash: "macos-1.0.0-patch",
//           size: 16663861,
//           fullHash: "macos-1.0.0-full",
//           fullSize: 71212089,
//           distribution: macosDistro,
//         },
//         {
//           hash: "linux-1.0.0-patch",
//           size: 16663861,
//           fullHash: "linux-1.0.0-full",
//           fullSize: 71212089,
//           distribution: linuxDistro,
//         },
//       ],
//     },
//   ];

//   const patchRepo = connection.em.getRepository(PatchEntity);
//   const releaseRepo = connection.em.getRepository(ReleaseEntity);

//   for (const release of releases) {
//     const releaseEntity = new ReleaseEntity();

//     const patches = await Promise.all(
//       release.patches.map(async (patch) => {
//         const patchEntity = new PatchEntity();

//         patchEntity.hash = patch.hash;
//         patchEntity.size = patch.size;
//         patchEntity.fullHash = patch.fullHash;
//         patchEntity.fullSize = patch.fullSize;
//         patchEntity.distribution = patch.distribution;

//         await patchRepo.persistAndFlush(patchEntity);

//         return patchEntity;
//       }),
//     );

//     releaseEntity.channel = release.channel;
//     releaseEntity.version = release.version;
//     releaseEntity.notes = release.notes;
//     releaseEntity.patches = patches;

//     await releaseRepo.persistAndFlush(releaseEntity);
//   }

//   await connection.close();
// };

// main();
console.log("xd");
