import "jest";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import request from "supertest";

import { runApp } from "../src/app";

describe("[e2e]: Patches", () => {
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
        hash: "windows-2.0.0-full",
        notes: "fourth-release",
        size: 61212089,
        version: "2.0.0",
        url: "/2.0.0.packed.7z",
        filename: "2.0.0.packed.7z",
      });

      expect(res.body.patches).toEqual([
        {
          hash: "fourth-2.0.0-patch",
          notes: "fourth-release",
          size: 11663861,
          version: "2.0.0",
          url: "/2.0.0.patch",
          filename: "2.0.0.patch",
        },
        {
          hash: "third-1.2.0-patch",
          notes: "third-release",
          size: 11663861,
          version: "1.2.0",
          url: "/1.2.0.patch",
          filename: "1.2.0.patch",
        },
        {
          hash: "windows-1.1.0-patch",
          notes: "second-release",
          size: 11663861,
          version: "1.1.0",
          url: "/1.1.0.patch",
          filename: "1.1.0.patch",
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
        hash: "macos-2.0.0-full",
        notes: "fourth-release",
        size: 51212089,
        version: "2.0.0",
        url: "/2.0.0.packed.7z",
        filename: "2.0.0.packed.7z",
      });
    });

    it("handles inconsistent releases", async () => {
      const res = await request(app.getHttpServer())
        .get("/updates")
        .query({ version: "1.0.0", channel: "stable", os: "linux" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("strategy", "patches");

      expect(res.body.full).toEqual({
        hash: "linux-1.2.0-full",
        notes: "third-release",
        size: 71212089,
        version: "1.2.0",
        url: "/1.2.0.packed.7z",
        filename: "1.2.0.packed.7z",
      });

      expect(res.body.patches).toEqual([
        {
          hash: "linux-1.2.0-patch",
          notes: "third-release",
          size: 16663861,
          version: "1.2.0",
          url: "/1.2.0.patch",
          filename: "1.2.0.patch",
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
        hash: "windows-alpha-2.1.0-full",
        notes: "alpha-third-release",
        size: 61212089,
        version: "2.1.0-alpha",
        url: "/2.1.0-alpha.packed.7z",
        filename: "2.1.0-alpha.packed.7z",
      });

      expect(res.body.patches).toEqual([
        {
          hash: "windows-alpha-2.1.0-patch",
          notes: "alpha-third-release",
          size: 11663861,
          version: "2.1.0-alpha",
          url: "/2.1.0-alpha.patch",
          filename: "2.1.0-alpha.patch",
        },
        {
          hash: "windows-alpha-1.2.0-patch",
          notes: "alpha-second-release",
          size: 11663861,
          version: "1.2.0-alpha",
          url: "/1.2.0-alpha.patch",
          filename: "1.2.0-alpha.patch",
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
});
