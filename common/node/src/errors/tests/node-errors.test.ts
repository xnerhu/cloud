import "jest";

import { handleNodeErrors } from "../../";

describe("@common/node errors/node-errors", () => {
  describe("handleNodeErrors", () => {
    it("listens for uncaught exceptions and rejections", async () => {
      const mockListener = jest
        .spyOn(process, "on")
        .mockImplementation((() => {}) as any);

      handleNodeErrors();

      expect(mockListener.mock.calls[0][0]).toEqual("uncaughtException");
      expect(mockListener.mock.calls[1][0]).toEqual("unhandledRejection");

      mockListener.mockRestore();
    });

    it("exits process on uncaught exception", async () => {
      const mockConsole = jest
        .spyOn(console, "error")
        .mockImplementation((() => {}) as any);

      const mockListener = jest.spyOn(process, "on").mockImplementation(((
        name: string,
        listener: any,
      ) => {
        if (name === "uncaughtException")
          listener(new Error("UNCAUGHT_EXCEPTION"));
      }) as any);

      const mockExit = jest
        .spyOn(process, "exit")
        .mockImplementation((() => {}) as any);

      handleNodeErrors();

      expect(mockExit).toHaveBeenCalledWith(1);

      mockListener.mockRestore();
      mockExit.mockRestore();
      mockConsole.mockRestore();
    });

    it("exits process on uncaught rejection", async () => {
      const mockConsole = jest
        .spyOn(console, "error")
        .mockImplementation((() => {}) as any);

      const mockListener = jest.spyOn(process, "on").mockImplementation(((
        name: string,
        listener: any,
      ) => {
        if (name === "unhandledRejection")
          listener(new Error("UNCAUGHT_REJECTION"));
      }) as any);

      const mockExit = jest
        .spyOn(process, "exit")
        .mockImplementation((() => {}) as any);

      handleNodeErrors();

      expect(mockExit).toHaveBeenCalledWith(1);

      mockListener.mockRestore();
      mockExit.mockRestore();
      mockConsole.mockRestore();
    });
  });
});
