import "jest";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import request from "supertest";

import { runApp } from "../../src/app";

describe("[e2e]: Updates", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await runApp();
  });

  afterAll(async () => {
    await app.close();
  });

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
