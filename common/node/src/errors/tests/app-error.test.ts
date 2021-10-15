import "jest";

import { createAppError, AppError } from "../../";

describe("@common/node errors/app-error", () => {
  describe("createAppError", () => {
    it("returns app error factory", async () => {
      const errFc = createAppError({ name: "OPERATIONAL_ERROR" }, true);

      expect(typeof errFc).toBe("function");
    });

    it("returns app error instance", async () => {
      const errFc = createAppError({ name: "OPERATIONAL_ERROR" }, true);

      expect(errFc()).toBeInstanceOf(AppError);
    });

    it("formats description", async () => {
      const errFc = createAppError(
        { name: "OPERATIONAL_ERROR", description: "START %s END" },
        true,
      );

      const fn = () => {
        throw errFc("INJECTED");
      };

      expect(fn).toThrowError("START INJECTED END");
    });

    it("is not operational by default", async () => {
      const errFc = createAppError({
        name: "NOT_OPERATIONAL_ERROR",
      });

      expect(errFc().isOperational).toEqual(false);
    });
  });
});
