import "jest";

import { isDev, isProduction, isTest } from "../";

describe("@common/node env", () => {
  const OLD_ENV = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  describe("isDev", () => {
    it("returns true if env is dev", async () => {
      process.env.NODE_ENV = "development";
      expect(isDev()).toEqual(true);
    });

    it("returns false if env is not dev", async () => {
      process.env.NODE_ENV = "production";
      expect(isDev()).toEqual(false);
    });
  });

  describe("isProduction", () => {
    it("returns true if env is production", async () => {
      process.env.NODE_ENV = "production";
      expect(isProduction()).toEqual(true);
    });

    it("returns false if env is not production", async () => {
      process.env.NODE_ENV = "development";
      expect(isProduction()).toEqual(false);
    });
  });

  describe("isTest", () => {
    it("returns true if env is test", async () => {
      process.env.NODE_ENV = "test";
      expect(isTest()).toEqual(true);
    });

    it("returns false if env is not test", async () => {
      process.env.NODE_ENV = "development";
      expect(isTest()).toEqual(false);
    });
  });
});
