import "jest";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import request from "supertest";
import { resolve } from "path";

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

        expect(res.body.full).toEqual({
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

      it("returns full if patches are heavier", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "1.0.0", channel: "stable", os: "macos" });

        expect(res.statusCode).toEqual(200);

        expect(res.body).toHaveProperty("strategy", "full");

        expect(res.body.full).toEqual({
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

        expect(res.body.full).toEqual({
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

        expect(res.body.full).toEqual({
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

    describe("/v1", () => {
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
      const res = await request(app.getHttpServer()).get("/admin/distribution");

      expect(res.statusCode).toEqual(403);
    });

    describe("/getDistribution", () => {
      it("returns distribution id", async () => {
        const res = await request(app.getHttpServer())
          .get("/admin/distribution")
          .set(API_KEY_HEADER, API_KEY)
          .query({ os: "macos", osVersion: "any", architecture: "arm" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ distributionId: 4 });
      });

      it("throws error if not found", async () => {
        const res = await request(app.getHttpServer())
          .get("/admin/distribution")
          .set(API_KEY_HEADER, API_KEY)
          .query({ os: "NOT_FOUND", osVersion: "any", architecture: "arm" });

        expect(res.statusCode).toBe(404);
      });
    });

    describe("Creating a new release", () => {
      describe("/release", () => {
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

      describe("/diff", () => {
        it("handles first-time releases", async () => {
          const res = await request(app.getHttpServer())
            .get("/admin/diff")
            .set(API_KEY_HEADER, API_KEY)
            .query({
              version: "4.0.0",
              channel: "stable",
              distributionId: 4,
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
              distributionId: 1,
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
        const PATH_FULL = resolve(PATH_ASSETS, "4.0.0.packed.7z");

        const getRequest = () => {
          return request(app.getHttpServer())
            .put("/admin/patch")
            .set(API_KEY_HEADER, API_KEY)
            .attach("patch", PATH_PATCH)
            .attach("full", PATH_FULL);
        };

        it("is not accessible without token", async () => {
          const res = await request(app.getHttpServer()).put("/admin/patch");

          expect(res.statusCode).toEqual(403);
        });

        it("throws error if patch is corrupt", async () => {
          const res = await getRequest()
            .field("releaseId", 8)
            .field("distributionId", 1)
            .field("hash", "d656e422b1b3027329a7128b636b0986")
            .field("fullHash", "dbbeb775238fad0a93172e3e965d83d7");

          expect(res.statusCode).toEqual(400);

          const message = res.body.message as string;

          expect(message.includes("corrupt")).toBe(true);
          expect(message.includes("d656e422b1b3027329a7128b636b0986")).toBe(
            true,
          );
        });

        it("throws error if full is corrupt", async () => {
          const res = await getRequest()
            .field("releaseId", 8)
            .field("distributionId", 1)
            .field("hash", "67faad59f243eeddadbc18789bc65bf0")
            .field("fullHash", "dbbeb775238fad0a93172e3e965d83d7");

          expect(res.statusCode).toEqual(400);

          const message = res.body.message as string;

          expect(message.includes("corrupt")).toBe(true);
          expect(message.includes("dbbeb775238fad0a93172e3e965d83d7")).toBe(
            true,
          );
        });

        it("throws error if patch is not provided", async () => {
          const res = await request(app.getHttpServer())
            .put("/admin/patch")
            .set(API_KEY_HEADER, API_KEY)
            .attach("full", PATH_FULL);

          expect(res.statusCode).toEqual(400);
        });

        it("throws error if full is not provided", async () => {
          const res = await request(app.getHttpServer())
            .put("/admin/patch")
            .set(API_KEY_HEADER, API_KEY)
            .attach("patch", PATH_PATCH);

          expect(res.statusCode).toEqual(400);
        });

        it("uploads patch and full, then returns info", async () => {
          const res = await getRequest()
            .field("releaseId", 8)
            .field("distributionId", 1)
            .field("hash", "67faad59f243eeddadbc18789bc65bf0")
            .field("fullHash", "36f81a68402b54768cace0bbcceab06a");

          expect(res.statusCode).toEqual(200);

          expect(res.body).toEqual({
            patch: {
              version: "4.0.0",
              notes: "new_release_notes",
              hash: "36f81a68402b54768cace0bbcceab06a",
              size: 151,
              filename: "4.0.0_stable_windows-x64-any.7z",
              url: "/updates/4.0.0_stable_windows-x64-any.7z",
            },
            full: {
              version: "4.0.0",
              notes: "new_release_notes",
              hash: "67faad59f243eeddadbc18789bc65bf0",
              size: 9,
              filename: "4.0.0_stable_windows-x64-any.patch",
              url: "/updates/4.0.0_stable_windows-x64-any.patch",
            },
          });
        });

        it("new patch is accessible from public API", async () => {
          const res = await request(app.getHttpServer())
            .get("/updates")
            .query({ version: "2.0.0", channel: "stable", os: "windows" });

          expect(res.statusCode).toEqual(200);

          expect(res.body).toEqual({
            strategy: "patches",
            full: {
              version: "4.0.0",
              notes: "new_release_notes",
              hash: "36f81a68402b54768cace0bbcceab06a",
              size: 151,
              filename: "4.0.0_stable_windows-x64-any.7z",
              url: "/updates/4.0.0_stable_windows-x64-any.7z",
            },
            patches: [
              {
                version: "4.0.0",
                notes: "new_release_notes",
                hash: "67faad59f243eeddadbc18789bc65bf0",
                size: 9,
                filename: "4.0.0_stable_windows-x64-any.patch",
                url: "/updates/4.0.0_stable_windows-x64-any.patch",
              },
            ],
          });
        });

        it("throws error if patch already exists", async () => {
          const res = await getRequest()
            .field("releaseId", 8)
            .field("distributionId", 1)
            .field("hash", "67faad59f243eeddadbc18789bc65bf0")
            .field("fullHash", "36f81a68402b54768cace0bbcceab06a");

          expect(res.statusCode).toEqual(400);
        });
      });
    });
  });
});
