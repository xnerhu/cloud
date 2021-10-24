import "jest";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import request from "supertest";
import { resolve } from "path";

import { runApp } from "../../src/app";
import { AssetType, ReleaseStatusType } from "@core/updates";

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

  describe("/updates", () => {
    it("handles up-to-date version", async () => {
      const res = await request(app.getHttpServer())
        .get("/updates")
        .query({ version: "1.3.0", channel: "stable", os: "windows" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("strategy", "none");
    });

    describe("irregularity", () => {
      it("handles the oldest version", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "1.0.0", channel: "stable", os: "windows" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          strategy: "patches",
          packed: {
            version: "1.3.0",
            notes: "1.3.0-stable-notes",
            filename: "1.3.0-stable-windows-x64.packed",
            hash: "1.3.0-stable-windows-x64.packed-hash",
            size: 40000,
            url: "/updates/1.3.0-stable-windows-x64.packed",
          },
          patches: [
            {
              version: "1.3.0",
              notes: "1.3.0-stable-notes",
              filename: "1.3.0-stable-windows-x64.patch",
              hash: "1.3.0-stable-windows-x64.patch-hash",
              size: 1024,
              url: "/updates/1.3.0-stable-windows-x64.patch",
            },
            {
              version: "1.2.0",
              notes: "1.2.0-stable-notes",
              filename: "1.2.0-stable-windows-x64.patch",
              hash: "1.2.0-stable-windows-x64.patch-hash",
              size: 1024,
              url: "/updates/1.2.0-stable-windows-x64.patch",
            },
            {
              version: "1.1.0",
              notes: "1.1.0-stable-notes",
              filename: "1.1.0-stable-windows-x64.patch",
              hash: "1.1.0-stable-windows-x64.patch-hash",
              size: 1024,
              url: "/updates/1.1.0-stable-windows-x64.patch",
            },
          ],
        });
      });

      it("handles gap between releases", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "1.0.0", channel: "stable", os: "linux" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          strategy: "patches",
          packed: {
            version: "1.2.0",
            notes: "1.2.0-stable-notes",
            filename: "1.2.0-stable-linux-x64.packed",
            hash: "1.2.0-stable-linux-x64.packed-hash",
            size: 40000,
            url: "/updates/1.2.0-stable-linux-x64.packed",
          },
          patches: [
            {
              version: "1.2.0",
              notes: "1.2.0-stable-notes",
              filename: "1.2.0-stable-linux-x64.patch",
              hash: "1.2.0-stable-linux-x64.patch-hash",
              size: 1024,
              url: "/updates/1.2.0-stable-linux-x64.patch",
            },
          ],
        });
      });

      it("handles releases that were added later", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "1.1.0", channel: "stable", os: "macos" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          strategy: "patches",
          packed: {
            version: "1.2.0",
            notes: "1.2.0-stable-notes",
            filename: "1.2.0-stable-macos-x64.packed",
            hash: "1.2.0-stable-macos-x64.packed-hash",
            size: 40000,
            url: "/updates/1.2.0-stable-macos-x64.packed",
          },
          patches: [
            {
              version: "1.2.0",
              notes: "1.2.0-stable-notes",
              filename: "1.2.0-stable-macos-x64.patch",
              hash: "1.2.0-stable-macos-x64.patch-hash",
              size: 1024,
              url: "/updates/1.2.0-stable-macos-x64.patch",
            },
          ],
        });
      });
    });

    describe("optimal update strategy", () => {
      it("handles patches heavier than packed", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "1.0.0", channel: "beta", os: "windows" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          strategy: "packed",
          packed: {
            version: "1.4.0",
            notes: "beta-1.4.0-notes",
            filename: "1.4.0-stable-windows-x64.packed",
            hash: "1.4.0-stable-windows-x64.packed-hash",
            size: 4000,
            url: "/updates/1.4.0-stable-windows-x64.packed",
          },
        });
      });

      it("handles patches lighter than packged", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "1.1.0", channel: "beta", os: "windows" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          strategy: "patches",
          packed: {
            version: "1.4.0",
            notes: "beta-1.4.0-notes",
            filename: "1.4.0-stable-windows-x64.packed",
            hash: "1.4.0-stable-windows-x64.packed-hash",
            size: 4000,
            url: "/updates/1.4.0-stable-windows-x64.packed",
          },
          patches: [
            {
              version: "1.4.0",
              notes: "beta-1.4.0-notes",
              filename: "1.4.0-beta-windows-x64.patch",
              hash: "1.4.0-beta-windows-x64.patch-hash",
              size: 1000,
              url: "/updates/1.4.0-beta-windows-x64.patch",
            },
            {
              version: "1.3.0",
              notes: "beta-1.3.0-notes",
              filename: "1.3.0-beta-windows-x64.patch",
              hash: "1.3.0-beta-windows-x64.patch-hash",
              size: 1000,
              url: "/updates/1.3.0-beta-windows-x64.patch",
            },
            {
              version: "1.2.0",
              notes: "beta-1.2.0-notes",
              filename: "1.2.0-beta-windows-x64.patch",
              hash: "1.2.0-beta-windows-x64.patch-hash",
              size: 1000,
              url: "/updates/1.2.0-beta-windows-x64.patch",
            },
          ],
        });
      });
    });

    describe("release status", () => {
      it("handles suspended release", async () => {
        const res = await request(app.getHttpServer())
          .get("/updates")
          .query({ version: "1.0.0", channel: "alpha", os: "windows" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          strategy: "patches",
          packed: {
            version: "1.2.0",
            notes: "alpha-1.2.0-notes",
            filename: "1.2.0-alpha-windows-x64.packed",
            hash: "1.2.0-alpha-windows-x64.packed-hash",
            size: 4000,
            url: "/updates/1.2.0-alpha-windows-x64.packed",
          },
          patches: [
            {
              version: "1.2.0",
              notes: "alpha-1.2.0-notes",
              filename: "1.2.0-alpha-windows-x64.patch",
              hash: "1.2.0-alpha-windows-x64.patch-hash",
              size: 1000,
              url: "/updates/1.2.0-alpha-windows-x64.patch",
            },
            {
              version: "1.1.0",
              notes: "alpha-1.1.0-notes",
              filename: "1.1.0-alpha-windows-x64.patch",
              hash: "1.1.0-alpha-windows-x64.patch-hash",
              size: 1000,
              url: "/updates/1.1.0-alpha-windows-x64.patch",
            },
          ],
        });
      });
    });

    describe("v1 backwards compatibility", () => {
      it("handles the oldest version", async () => {
        const res = await request(app.getHttpServer())
          .get("/v1")
          .query({ browserVersion: "1.0.0" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          type: "patches",
          fullFile: {
            filename: "1.3.0-stable-windows-x64.packed",
            url: "/updates/1.3.0-stable-windows-x64.packed",
          },
          patches: [
            {
              filename: "1.3.0-stable-windows-x64.patch",
              url: "/updates/1.3.0-stable-windows-x64.patch",
            },
            {
              filename: "1.2.0-stable-windows-x64.patch",
              url: "/updates/1.2.0-stable-windows-x64.patch",
            },
            {
              filename: "1.1.0-stable-windows-x64.patch",
              url: "/updates/1.1.0-stable-windows-x64.patch",
            },
          ],
        });
      });

      it("handles up-to-date version", async () => {
        const res = await request(app.getHttpServer())
          .get("/v1")
          .query({ browserVersion: "1.3.0" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ type: "none" });
      });
    });

    describe("Admin API", () => {
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
                version: "2.0.0",
                channel: "stable",
                notes: "new_release_notes",
              });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("releaseId", 14);
          });

          it("new release is not accessible from /updates", async () => {
            const res = await request(app.getHttpServer())
              .get("/updates")
              .query({ version: "1.3.0", channel: "stable", os: "windows" });

            expect(res.body).toHaveProperty("strategy", "none");
          });

          it("doesn't create new release if it exists", async () => {
            const res = await request(app.getHttpServer())
              .put("/admin/release")
              .set(API_KEY_HEADER, API_KEY)
              .send({
                version: "1.3.0",
                channel: "stable",
                notes: "new_release_notes",
              });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ releaseId: 4, created: false });
          });
        });

        describe("/admin/diff", () => {
          it("handles first-time releases", async () => {
            const res = await request(app.getHttpServer())
              .get("/admin/diff")
              .set(API_KEY_HEADER, API_KEY)
              .query({
                version: "2.0.0",
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
                version: "2.0.0",
                channel: "stable",
                os: "windows",
                osVersion: "any",
                architecture: "x64",
              });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
              asset: {
                filename: "1.3.0-stable-windows-x64.packed",
                hash: "1.3.0-stable-windows-x64.packed-hash",
                size: 40000,
                url: "/updates/1.3.0-stable-windows-x64.packed",
              },
            });
          });
        });

        describe("/admin/asset", () => {
          const PATH_PATCH = resolve(PATH_ASSETS, "4.0.0.patch");
          const PATH_PACKED = resolve(PATH_ASSETS, "4.0.0.packed.7z");
          const PATH_FORMAT_TEST = resolve(PATH_ASSETS, "format-test.png");

          const HASH_PATCH = "67faad59f243eeddadbc18789bc65bf0";
          const HASH_PACKED = "36f81a68402b54768cace0bbcceab06a";

          type FileType = "patch" | "packed";
          interface RequestOptions {
            auth?: boolean;
            /**
             * Release and Distribution info
             */
            info?: "all" | "distribution" | "release";
            hash?: FileType;
            file?: FileType;
          }

          const createRequest = ({
            auth,
            info,
            hash,
            file,
          }: RequestOptions) => {
            let req = request(app.getHttpServer()).put("/admin/asset");

            if (auth) {
              req = req.set(API_KEY_HEADER, API_KEY);
            }

            if (info === "distribution" || info === "all") {
              req = req
                .field("os", "windows")
                .field("osVersion", "any")
                .field("architecture", "x64");
            }

            if (info === "release" || info === "all") {
              req = req.field("version", "2.0.0").field("channel", "stable");
            }

            if (hash === "patch") {
              req = req
                .field("hash", HASH_PATCH)
                .field("type", AssetType.PATCH);
            } else if (hash === "packed") {
              req = req
                .field("hash", HASH_PACKED)
                .field("type", AssetType.PACKED);
            }

            if (file === "patch") {
              req = req
                .attach("asset", PATH_PATCH)
                .field("type", AssetType.PATCH);
            } else if (file === "packed") {
              req = req
                .attach("asset", PATH_PACKED)
                .field("type", AssetType.PACKED);
            }

            return req;
          };

          it("is not accessible without token", async () => {
            const res = await createRequest({});

            expect(res.statusCode).toEqual(403);
          });

          it("throws error if asset type is incorrect", async () => {
            const res = await createRequest({
              auth: true,
              info: "all",
              hash: "patch",
              file: "patch",
            }).field("type", -1);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual("Incorrect asset type");
          });

          it("throws error if release doesn't exists", async () => {
            const res = await createRequest({
              auth: true,
              info: "distribution",
              file: "packed",
              hash: "packed",
            })
              .field("version", "5.0.0")
              .field("channel", "stable");

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual("Release not found");
          });

          it("throws error if distribution doesn't exists", async () => {
            const res = await createRequest({
              auth: true,
              info: "release",
              file: "packed",
              hash: "packed",
            })
              .field("os", "windows")
              .field("osVersion", "any")
              .field("architecture", "arm");

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual("Distribution not found");
          });

          it("throws error if file is not provided", async () => {
            const res = await createRequest({
              auth: true,
              info: "all",
              hash: "packed",
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual("No file provided");
          });

          it("throws error if file format is incorrect", async () => {
            const res = await createRequest({
              auth: true,
              info: "all",
            })
              .attach("asset", PATH_FORMAT_TEST)
              .field("hash", "d656e422b1b3027329a7128b636b0986")
              .field("type", AssetType.INSTALLER);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual("Incorrect file format");
          });

          it("throws error if file is corrupted", async () => {
            const res = await createRequest({
              auth: true,
              info: "all",
              file: "patch",
            }).field("hash", "remote_hash_currupt_test");

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual(
              "File is corrupted. Expected remote_hash_currupt_test, got: 67faad59f243eeddadbc18789bc65bf0",
            );
          });

          it("uploads packed and returns info", async () => {
            const res = await createRequest({
              auth: true,
              info: "all",
              file: "packed",
              hash: "packed",
            });

            expect(res.statusCode).toEqual(200);

            expect(res.body.asset).toHaveProperty("size", 151);
            expect(res.body.asset).toHaveProperty("hash", HASH_PACKED);

            expect(res.body.asset.filename.endsWith(".packed.7z")).toBe(true);
            expect(/^\/updates.*.packed.7z$/.test(res.body.asset.url)).toBe(
              true,
            );
          });

          it("uploads patch and returns info", async () => {
            const res = await createRequest({
              auth: true,
              info: "all",
              file: "patch",
              hash: "patch",
            });

            expect(res.statusCode).toEqual(200);

            expect(res.body.asset).toHaveProperty("size", 9);
            expect(res.body.asset).toHaveProperty("hash", HASH_PATCH);

            expect(res.body.asset.filename.endsWith(".patch")).toBe(true);
            expect(/^\/updates.*.patch$/.test(res.body.asset.url)).toBe(true);
          });

          it("throws error if asset already exists", async () => {
            const res = await createRequest({
              auth: true,
              info: "all",
              file: "patch",
              hash: "patch",
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual(
              "Asset for this distribution already exists",
            );
          });

          it("release is not yet accessible", async () => {
            const res = await request(app.getHttpServer())
              .get("/updates")
              .query({ version: "1.3.0", channel: "stable", os: "windows" });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("strategy", "none");
          });
        });

        describe("/admin/status", () => {
          it("throws error if status type is incorrect", async () => {
            const res = await request(app.getHttpServer())
              .post("/admin/status")
              .set(API_KEY_HEADER, API_KEY)
              .send({
                version: "5.0.0",
                channel: "stable",
                status: -1,
              });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual("Incorrect status type");
          });

          it("throws error if release doesn't exists", async () => {
            const res = await request(app.getHttpServer())
              .post("/admin/status")
              .set(API_KEY_HEADER, API_KEY)
              .send({
                version: "5.0.0",
                channel: "stable",
                status: ReleaseStatusType.SUSPENDED,
              });

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual("Release not found");
          });

          it("changes release status", async () => {
            const res = await request(app.getHttpServer())
              .post("/admin/status")
              .set(API_KEY_HEADER, API_KEY)
              .send({
                version: "2.0.0",
                channel: "stable",
                status: ReleaseStatusType.ROLLED_OUT,
              });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({ changed: true });
          });

          it("doesn't change release status if it has already given status", async () => {
            const res = await request(app.getHttpServer())
              .post("/admin/status")
              .set(API_KEY_HEADER, API_KEY)
              .send({
                version: "2.0.0",
                channel: "stable",
                status: ReleaseStatusType.ROLLED_OUT,
              });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({ changed: false });
          });

          it("release is accessible after changing status", async () => {
            const res = await request(app.getHttpServer())
              .get("/updates")
              .query({ version: "1.3.0", channel: "stable", os: "windows" });

            expect(res.statusCode).toEqual(200);

            expect(res.body).toHaveProperty("strategy", "patches");
            expect(res.body.packed).toHaveProperty("version", "2.0.0");
            expect(res.body.packed.filename.endsWith(".packed.7z")).toEqual(
              true,
            );

            expect(res.body.patches.length).toEqual(1);
            expect(res.body.patches[0]).toHaveProperty("version", "2.0.0");

            expect(res.body.patches[0].filename.endsWith(".patch")).toEqual(
              true,
            );
          });
        });
      });
    });
  });
});
