import { MikroORM, ReflectMetadataProvider } from "@mikro-orm/core";
import { AssetType, ReleaseStatusType } from "@core/updates";

import { DistributionEntity } from "../src/distributions/distribution-entity";
import config from "../src/mikro-orm-config";
import { ReleaseEntity } from "../src/releases/release-entity";
import { AssetEntity } from "../src/assets/asset-entity";

export default async () => {
  const connection = await MikroORM.init({
    ...config,
    metadataProvider: ReflectMetadataProvider,
  });

  const distributionsRepo = connection.em.getRepository(DistributionEntity);
  const releasesRepo = connection.em.getRepository(ReleaseEntity);

  const WINDOWS_X64 = new DistributionEntity({
    os: "windows",
    architecture: "x64",
  });

  const LINUX_X64 = new DistributionEntity({
    os: "linux",
    architecture: "x64",
  });

  const MACOS_X64 = new DistributionEntity({
    os: "macos",
    architecture: "x64",
  });

  const MACOS_ARM = new DistributionEntity({
    os: "macos",
    architecture: "arm",
  });

  await distributionsRepo.persistAndFlush([
    WINDOWS_X64,
    LINUX_X64,
    MACOS_X64,
    MACOS_ARM,
  ]);

  const irregularUpdatesTest = [
    new ReleaseEntity({
      version: "1.3.0",
      channel: "stable",
      notes: "1.3.0-stable-notes",
      status: ReleaseStatusType.ROLLED_OUT,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.3.0-stable-windows-x64.patch",
          hash: "1.3.0-stable-windows-x64.patch-hash",
          size: 1024,
          type: AssetType.PATCH,
        }),
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.3.0-stable-windows-x64.packed",
          hash: "1.3.0-stable-windows-x64.packed-hash",
          size: 40000,
          type: AssetType.PACKED,
        }),
      ],
    }),
    new ReleaseEntity({
      version: "1.2.0",
      channel: "stable",
      notes: "1.2.0-stable-notes",
      status: ReleaseStatusType.ROLLED_OUT,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.2.0-stable-windows-x64.patch",
          hash: "1.2.0-stable-windows-x64.patch-hash",
          size: 1024,
          type: AssetType.PATCH,
        }),
        new AssetEntity({
          distribution: MACOS_X64,
          filename: "1.2.0-stable-macos-x64.patch",
          hash: "1.2.0-stable-macos-x64.patch-hash",
          size: 1024,
          type: AssetType.PATCH,
        }),
        new AssetEntity({
          distribution: MACOS_X64,
          filename: "1.2.0-stable-macos-x64.packed",
          hash: "1.2.0-stable-macos-x64.packed-hash",
          size: 40000,
          type: AssetType.PACKED,
        }),
        new AssetEntity({
          distribution: LINUX_X64,
          filename: "1.2.0-stable-linux-x64.patch",
          hash: "1.2.0-stable-linux-x64.patch-hash",
          size: 1024,
          type: AssetType.PATCH,
        }),
        new AssetEntity({
          distribution: LINUX_X64,
          filename: "1.2.0-stable-linux-x64.packed",
          hash: "1.2.0-stable-linux-x64.packed-hash",
          size: 40000,
          type: AssetType.PACKED,
        }),
      ],
    }),
    new ReleaseEntity({
      version: "1.1.0",
      channel: "stable",
      notes: "1.1.0-stable-notes",
      status: ReleaseStatusType.ROLLED_OUT,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.1.0-stable-windows-x64.patch",
          hash: "1.1.0-stable-windows-x64.patch-hash",
          size: 1024,
          type: AssetType.PATCH,
        }),
        new AssetEntity({
          distribution: MACOS_X64,
          filename: "1.1.0-stable-macos-x64.patch",
          hash: "1.1.0-stable-macos-x64.patch-hash",
          size: 1024,
          type: AssetType.PATCH,
        }),
      ],
    }),
    new ReleaseEntity({
      version: "1.0.0",
      channel: "stable",
      notes: "1.0.0-stable-notes",
      status: ReleaseStatusType.ROLLED_OUT,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.0.0-stable-windows-x64.patch",
          hash: "1.0.0-stable-windows-x64.patch-hash",
          size: 1024,
          type: AssetType.PATCH,
        }),
        new AssetEntity({
          distribution: LINUX_X64,
          filename: "1.0.0-stable-linux-x64.patch",
          hash: "1.0.0-stable-linux-x64.patch-hash",
          size: 1024,
          type: AssetType.PATCH,
        }),
      ],
    }),
  ];

  /* --------------------------------------------------------------------------- */

  const optimalUpdateStrategyTest = [
    new ReleaseEntity({
      version: "1.4.0",
      channel: "beta",
      notes: "beta-1.4.0-notes",
      status: ReleaseStatusType.ROLLED_OUT,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.4.0-beta-windows-x64.patch",
          hash: "1.4.0-beta-windows-x64.patch-hash",
          size: 1000,
          type: AssetType.PATCH,
        }),
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.4.0-stable-windows-x64.packed",
          hash: "1.4.0-stable-windows-x64.packed-hash",
          size: 4000,
          type: AssetType.PACKED,
        }),
      ],
    }),
    new ReleaseEntity({
      version: "1.3.0",
      channel: "beta",
      notes: "beta-1.3.0-notes",
      status: ReleaseStatusType.ROLLED_OUT,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.3.0-beta-windows-x64.patch",
          hash: "1.3.0-beta-windows-x64.patch-hash",
          size: 1000,
          type: AssetType.PATCH,
        }),
      ],
    }),
    new ReleaseEntity({
      version: "1.2.0",
      channel: "beta",
      notes: "beta-1.2.0-notes",
      status: ReleaseStatusType.ROLLED_OUT,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.2.0-beta-windows-x64.patch",
          hash: "1.2.0-beta-windows-x64.patch-hash",
          size: 1000,
          type: AssetType.PATCH,
        }),
      ],
    }),
    new ReleaseEntity({
      version: "1.1.0",
      channel: "beta",
      notes: "beta-1.1.0-notes",
      status: ReleaseStatusType.ROLLED_OUT,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.1.0-beta-windows-x64.patch",
          hash: "1.1.0-beta-windows-x64.patch-hash",
          size: 1000,
          type: AssetType.PATCH,
        }),
      ],
    }),
    new ReleaseEntity({
      version: "1.0.0",
      channel: "beta",
      notes: "beta-1.0.0-notes",
      status: ReleaseStatusType.ROLLED_OUT,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.0.0-beta-windows-x64.patch",
          hash: "1.0.0-beta-windows-x64.patch-hash",
          size: 1000,
          type: AssetType.PATCH,
        }),
      ],
    }),
  ];

  /* --------------------------------------------------------------------------- */

  const suspendTest = [
    new ReleaseEntity({
      version: "1.3.0",
      channel: "alpha",
      notes: "alpha-1.3.0-notes",
      status: ReleaseStatusType.SUSPENDED,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.3.0-alpha-windows-x64.patch",
          hash: "1.3.0-alpha-windows-x64.patch-hash",
          size: 1000,
          type: AssetType.PATCH,
        }),
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.3.0-alpha-windows-x64.packed",
          hash: "1.3.0-alpha-windows-x64.packed-hash",
          size: 4000,
          type: AssetType.PACKED,
        }),
      ],
    }),
    new ReleaseEntity({
      version: "1.2.0",
      channel: "alpha",
      notes: "alpha-1.2.0-notes",
      status: ReleaseStatusType.ROLLED_OUT,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.2.0-alpha-windows-x64.patch",
          hash: "1.2.0-alpha-windows-x64.patch-hash",
          size: 1000,
          type: AssetType.PATCH,
        }),
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.2.0-alpha-windows-x64.packed",
          hash: "1.2.0-alpha-windows-x64.packed-hash",
          size: 4000,
          type: AssetType.PACKED,
        }),
      ],
    }),
    new ReleaseEntity({
      version: "1.1.0",
      channel: "alpha",
      notes: "alpha-1.1.0-notes",
      status: ReleaseStatusType.ROLLED_OUT,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.1.0-alpha-windows-x64.patch",
          hash: "1.1.0-alpha-windows-x64.patch-hash",
          size: 1000,
          type: AssetType.PATCH,
        }),
      ],
    }),
    new ReleaseEntity({
      version: "1.0.0",
      channel: "alpha",
      notes: "alpha-1.0.0-notes",
      status: ReleaseStatusType.ROLLED_OUT,
      assets: [
        new AssetEntity({
          distribution: WINDOWS_X64,
          filename: "1.0.0-alpha-windows-x64.patch",
          hash: "1.0.0-alpha-windows-x64.patch-hash",
          size: 1000,
          type: AssetType.PATCH,
        }),
      ],
    }),
  ];

  await releasesRepo.persistAndFlush([
    ...irregularUpdatesTest.reverse(),
    ...optimalUpdateStrategyTest.reverse(),
    ...suspendTest.reverse(),
  ]);

  await connection.close();
};
