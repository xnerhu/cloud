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
    app = await runApp(3002);
  });

  afterAll(async () => {
    await app.close();
  });

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
      const getRequest = () => {
        return request(app.getHttpServer())
          .put("/admin/patch")
          .set(API_KEY_HEADER, API_KEY)
          .attach("patch", resolve(PATH_ASSETS, "4.0.0.patch"))
          .attach("full", resolve(PATH_ASSETS, "4.0.0.packed.7z"));
      };

      it("validates patch file", async () => {
        const res = await getRequest()
          .field("releaseId", 8)
          .field("distributionId", 1)
          .field("hash", "d656e422b1b3027329a7128b636b0986")
          .field("fullHash", "dbbeb775238fad0a93172e3e965d83d7");

        expect(res.statusCode).toEqual(400);

        const message = res.body.message as string;

        expect(message.includes("corrupt")).toBe(true);
        expect(message.includes("d656e422b1b3027329a7128b636b0986")).toBe(true);
      });
    });
  });
});
