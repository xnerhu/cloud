import "jest";

import { AppError, handleError, isErrorOperational } from "../../";

describe("@common/node errors/error-handler", () => {
  describe("isErrorOperational", () => {
    it("returns false if it is a native Error object", async () => {
      expect(isErrorOperational(new Error())).toEqual(false);
    });

    it("returns false if it is an App Error and is not operational", async () => {
      expect(
        isErrorOperational(new AppError({ name: "APP_ERROR" }, false)),
      ).toEqual(false);
    });

    it("returns true if it is an App Error and is operational", async () => {
      expect(
        isErrorOperational(new AppError({ name: "APP_ERROR" }, true)),
      ).toEqual(true);
    });
  });

  describe("handleError", () => {
    it("returns true if error operational", async () => {
      expect(handleError(new AppError({ name: "APP_ERROR" }, true))).toEqual(
        true,
      );
    });

    it("exits process if error is not operational", async () => {
      const mockConsole = jest
        .spyOn(console, "error")
        .mockImplementation((() => {}) as any);

      const mockExit = jest
        .spyOn(process, "exit")
        .mockImplementation((() => {}) as any);

      handleError(new AppError({ name: "APP_ERROR" }, false));

      expect(mockExit).toBeCalledWith(1);

      mockExit.mockRestore();
      mockConsole.mockRestore();
    });
  });
});
