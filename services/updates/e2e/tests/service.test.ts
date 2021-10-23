import "jest";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import request from "supertest";
import { resolve } from "path";
import { omitKeys } from "@common/utils";

import { runApp } from "../../src/app";

const API_KEY = "TEST_TOKEN";
const API_KEY_HEADER = "authorization";

const PATH_ASSETS = resolve(__dirname, "../assets");

describe("[e2e]: Admin", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await runApp(3001);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("API accessible from browser", () => {
    describe("/updates", () => {
      it("handles up-to-date version", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "2.0.0", channel: "stable", os: "windows" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("strategy", "none");
      });

      it("returns patches", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "1.0.0", channel: "stable", os: "windows" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("strategy", "patches");

        expect(res.body.packed).toEqual({
          version: "2.0.0",
          notes: "fourth-release",
          hash: "windows-2.0.0-full",
          size: 61212089,
          filename: "2.0.0-windows.packed.7z",
          url: "/updates/2.0.0-windows.packed.7z",
        });

        expect(res.body.patches).toEqual([
          {
            version: "2.0.0",
            notes: "fourth-release",
            hash: "fourth-2.0.0-patch",
            size: 11663861,
            filename: "2.0.0-windows.patch",
            url: "/updates/2.0.0-windows.patch",
          },
          {
            version: "1.2.0",
            notes: "third-release",
            hash: "third-1.2.0-patch",
            size: 11663861,
            filename: "1.2.0-windows.patch",
            url: "/updates/1.2.0-windows.patch",
          },
          {
            version: "1.1.0",
            notes: "second-release",
            hash: "windows-1.1.0-patch",
            size: 11663861,
            filename: "1.1.0-windows.patch",
            url: "/updates/1.1.0-windows.patch",
          },
        ]);
      });

      it("returns packed if patches are heavier", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "1.0.0", channel: "stable", os: "macos" });

        expect(res.statusCode).toEqual(200);

        expect(res.body).toHaveProperty("strategy", "packed");

        expect(res.body.packed).toEqual({
          version: "2.0.0",
          notes: "fourth-release",
          hash: "macos-2.0.0-full",
          size: 51212089,
          filename: "2.0.0-macos.packed.7z",
          url: "/updates/2.0.0-macos.packed.7z",
        });
      });

      it("handles inconsistent releases", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "1.0.0", channel: "stable", os: "linux" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("strategy", "patches");

        expect(res.body.packed).toEqual({
          version: "1.2.0",
          notes: "third-release",
          hash: "linux-1.2.0-full",
          size: 71212089,
          filename: "1.2.0-linux.packed.7z",
          url: "/updates/1.2.0-linux.packed.7z",
        });

        expect(res.body.patches).toEqual([
          {
            version: "1.2.0",
            notes: "third-release",
            hash: "linux-1.2.0-patch",
            size: 16663861,
            filename: "1.2.0-linux.patch",
            url: "/updates/1.2.0-linux.patch",
          },
        ]);
      });

      it("handles channel", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "1.0.0-alpha", channel: "alpha", os: "windows" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("strategy", "patches");

        expect(res.body.packed).toEqual({
          version: "2.1.0-alpha",
          notes: "alpha-third-release",
          hash: "windows-alpha-2.1.0-full",
          size: 61212089,
          filename: "2.1.0-windows.packed.7z",
          url: "/updates/2.1.0-windows.packed.7z",
        });

        expect(res.body.patches).toEqual([
          {
            version: "2.1.0-alpha",
            notes: "alpha-third-release",
            hash: "windows-alpha-2.1.0-patch",
            size: 11663861,
            filename: "2.1.0-windows.patch",
            url: "/updates/2.1.0-windows.patch",
          },
          {
            version: "1.2.0-alpha",
            notes: "alpha-second-release",
            hash: "windows-alpha-1.2.0-patch",
            size: 11663861,
            filename: "1.2.0-alpha-windows.patch",
            url: "/updates/1.2.0-alpha-windows.patch",
          },
        ]);
      });

      it("handles incorrect distribution", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "1.0.0", os: "incorrect" });

        expect(res.statusCode).toEqual(400);
      });
    });

    describe("/v1 - backwards compatibility", () => {
      it("returns patches", async () => {
        const res = await request(app.getHttpServer())
          .get("/v1")
          .query({ browserVersion: "1.0.0" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          type: "patches",
          fullFile: {
            filename: "2.0.0-windows.packed.7z",
            url: "/updates/2.0.0-windows.packed.7z",
          },
          patches: [
            {
              filename: "2.0.0-windows.patch",
              url: "/updates/2.0.0-windows.patch",
            },
            {
              filename: "1.2.0-windows.patch",
              url: "/updates/1.2.0-windows.patch",
            },
            {
              filename: "1.1.0-windows.patch",
              url: "/updates/1.1.0-windows.patch",
            },
          ],
        });
      });

      it("handles up-to-date browser", async () => {
        const res = await request(app.getHttpServer())
          .get("/v1")
          .query({ browserVersion: "2.0.0" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ type: "none" });
      });
    });
  });

  describe("API for new releases", () => {
    it("is not accessible without token", async () => {
      const res = await request(app.getHttpServer()).get("/admin/diff");

      expect(res.statusCode).toEqual(403);
    });

    describe("Creating a new release", () => {
      describe("/admin/release", () => {
        it("creates a new release", async () => {
          const res = await request(app.getHttpServer())
            .put("/admin/release")
            .set(API_KEY_HEADER, API_KEY)
            .send({
              version: "4.0.0",
              channel: "stable",
              notes: "new_release_notes",
            });

          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty("releaseId", 8);
        });

        it("new release is not accessible from /updates", async () => {
          const res = await request(app.getHttpServer())
            .get("/updates")
            .query({ version: "2.0.0", channel: "stable", os: "windows" });

          expect(res.body).toHaveProperty("strategy", "none");
        });

        it("doesn't create new release if it exists", async () => {
          const res = await request(app.getHttpServer())
            .put("/admin/release")
            .set(API_KEY_HEADER, API_KEY)
            .send({
              version: "4.0.0",
              channel: "stable",
              notes: "new_release_notes",
            });

          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty("releaseId", 8);
        });
      });

      describe("/admin/diff", () => {
        it("handles first-time releases", async () => {
          const res = await request(app.getHttpServer())
            .get("/admin/diff")
            .set(API_KEY_HEADER, API_KEY)
            .query({
              version: "4.0.0",
              channel: "stable",
              os: "macos",
              architecture: "arm",
              osVersion: "any",
            });

          expect(res.statusCode).toEqual(404);
        });

        it("returns data to make diff", async () => {
          const res = await request(app.getHttpServer())
            .get("/admin/diff")
            .set(API_KEY_HEADER, API_KEY)
            .query({
              version: "4.0.0",
              channel: "stable",
              os: "windows",
              osVersion: "any",
              architecture: "x64",
            });

          expect(res.statusCode).toEqual(200);
          expect(res.body).toEqual({
            version: "2.0.0",
            notes: "fourth-release",
            hash: "windows-2.0.0-full",
            size: 61212089,
            filename: "2.0.0-windows.packed.7z",
            url: "/updates/2.0.0-windows.packed.7z",
          });
        });
      });

      describe("/patch", () => {
        const PATH_PATCH = resolve(PATH_ASSETS, "4.0.0.patch");
        const PATH_PACKED = resolve(PATH_ASSETS, "4.0.0.packed.7z");
        const PATH_FORMAT_TEST = resolve(PATH_ASSETS, "format-test.png");

        const HASH_PATCH = "67faad59f243eeddadbc18789bc65bf0";
        const HASH_PACKED = "36f81a68402b54768cace0bbcceab06a";

        const getRequestBase = () => {
          return request(app.getHttpServer())
            .put("/admin/patch")
            .set(API_KEY_HEADER, API_KEY);
        };

        const getRequestWithDistribution = () => {
          return getRequestBase()
            .field("os", "windows")
            .field("osVersion", "any")
            .field("architecture", "x64")
            .field("version", "4.0.0")
            .field("channel", "stable");
        };

        const getRequestWithAssets = () => {
          return getRequestWithDistribution()
            .attach("patch", PATH_PATCH)
            .attach("packed", PATH_PACKED);
        };

        const getRequestWithAssetsAndHashes = () => {
          return getRequestWithAssets()
            .field("patchHash", HASH_PATCH)
            .field("packedHash", HASH_PACKED);
        };

        it("is not accessible without token", async () => {
          const res = await request(app.getHttpServer()).put("/admin/patch");

          expect(res.statusCode).toEqual(403);
        });

        it("throws error if file format is incorrect", async () => {
          const res = await getRequestWithDistribution()
            .attach("patch", PATH_FORMAT_TEST)
            .attach("packed", PATH_FORMAT_TEST)
            .field("patchHash", "d656e422b1b3027329a7128b636b0986")
            .field("packedHash", "dbbeb775238fad0a93172e3e965d83d7");

          expect(res.statusCode).toEqual(400);
        });

        it("throws error if patch is corrupt", async () => {
          const res = await getRequestWithAssets()
            .field("patchHash", "d656e422b1b3027329a7128b636b0986")
            .field("packedHash", "dbbeb775238fad0a93172e3e965d83d7");

          const message = res.body.message as string;

          expect(res.statusCode).toEqual(400);

          expect(message.includes("corrupt")).toBe(true);
          expect(message.includes("d656e422b1b3027329a7128b636b0986")).toBe(
            true,
          );
        });

        it("throws error if packed is corrupt", async () => {
          const res = await getRequestWithAssets()
            .field("patchHash", HASH_PATCH)
            .field("packedHash", "dbbeb775238fad0a93172e3e965d83d7");

          expect(res.statusCode).toEqual(400);

          const message = res.body.message as string;

          expect(message.includes("corrupt")).toBe(true);
          expect(message.includes("dbbeb775238fad0a93172e3e965d83d7")).toBe(
            true,
          );
        });

        it("throws error if patch is not provided", async () => {
          const res = await getRequestWithDistribution()
            .attach("packed", PATH_PACKED)
            .field("patchHash", HASH_PATCH)
            .field("packedHash", HASH_PACKED);

          expect(res.statusCode).toEqual(400);
          expect(res.body.message).toBe("Patch file not provided");
        });

        it("throws error if packed is not provided", async () => {
          const res = await getRequestWithDistribution()
            .attach("patch", PATH_PATCH)
            .field("patchHash", HASH_PATCH)
            .field("packedHash", HASH_PACKED);

          expect(res.statusCode).toEqual(400);
          expect(res.body.message).toBe("Packed file not provided");
        });

        it("uploads assets and returns info", async () => {
          const res = await getRequestWithAssetsAndHashes();

          expect(res.statusCode).toEqual(200);

          const OMIT_KEYS_LIST = ["filename", "url"];

          // We want to omit file keys because they are unique
          expect({
            patch: omitKeys(res.body.patch, OMIT_KEYS_LIST),
            packed: omitKeys(res.body.packed, OMIT_KEYS_LIST),
          }).toEqual({
            patch: {
              version: "4.0.0",
              notes: "new_release_notes",
              hash: HASH_PATCH,
              size: 9,
            },
            packed: {
              version: "4.0.0",
              notes: "new_release_notes",
              hash: HASH_PACKED,
              size: 151,
            },
          });

          expect(res.body.patch.filename.endsWith(".patch")).toBe(true);
          expect(/^\/updates.*.patch$/.test(res.body.patch.url)).toBe(true);

          expect(res.body.packed.filename.endsWith(".packed.7z")).toBe(true);
          expect(/^\/updates.*.packed.7z$/.test(res.body.packed.url)).toBe(
            true,
          );
        });

        it("new patch is accessible from public API", async () => {
          const res = await request(app.getHttpServer())
            .get("/updates")
            .query({ version: "2.0.0", channel: "stable", os: "windows" });

          expect(res.statusCode).toEqual(200);

          const OMIT_KEYS_LIST = ["filename", "url"];

          const body = {
            ...res.body,
            packed: omitKeys(res.body.packed, OMIT_KEYS_LIST),
            patches: res.body.patches.map((patch) =>
              omitKeys(patch, OMIT_KEYS_LIST),
            ),
          };

          expect(body).toEqual({
            strategy: "patches",
            packed: {
              version: "4.0.0",
              notes: "new_release_notes",
              hash: HASH_PACKED,
              size: 151,
            },
            patches: [
              {
                version: "4.0.0",
                notes: "new_release_notes",
                hash: HASH_PATCH,
                size: 9,
              },
            ],
          });

          expect(res.body.patches[0].filename.endsWith(".patch")).toBe(true);
          expect(/^\/updates.*.patch$/.test(res.body.patches[0].url)).toBe(
            true,
          );

          expect(res.body.packed.filename.endsWith(".packed.7z")).toBe(true);
          expect(/^\/updates.*.packed.7z$/.test(res.body.packed.url)).toBe(
            true,
          );
        });

        it("throws error if patch already exists", async () => {
          const res = await getRequestWithAssetsAndHashes();

          expect(res.statusCode).toEqual(400);
          expect(res.body.message.includes("already exists")).toBe(true);
        });
      });
    });
  });
});
