import "jest";

import { PatchEntry } from "../../patches/patches-service";
import { UpdateStrategy, UpdateEntry } from "../updates-response";
import { getUpdateEntryFetchInfo, getUpdateStrategy } from "../updates-utils";

describe("Update utils", () => {
  describe("getUpdateStrategy", () => {
    it("handles patches smaller than full", () => {
      expect(
        getUpdateStrategy(
          { fullSize: 1000, size: 0 } as PatchEntry,
          [{ size: 100 }, { size: 500 }, { size: 10 }] as PatchEntry[],
        ),
      ).toEqual<UpdateStrategy>("patches");
    });

    it("handles patches bigger than full", () => {
      expect(
        getUpdateStrategy(
          { fullSize: 1000, size: 0 } as PatchEntry,
          [{ size: 100 }, { size: 500 }, { size: 400 }] as PatchEntry[],
        ),
      ).toEqual<UpdateStrategy>("full");
    });

    it("handles neither patches nor full", () => {
      expect(getUpdateStrategy(undefined, [])).toEqual<UpdateStrategy>("none");
    });
  });

  describe("getUpdateEntryFetchInfo", () => {
    it("formats patch file", () => {
      expect(
        getUpdateEntryFetchInfo(
          {
            hash: "patchHash",
            notes: "patch_notes",
            size: 1024,
            version: "1.0.0",
          } as PatchEntry,
          true,
          "PUBLIC_URL",
        ),
      ).toEqual<UpdateEntry>({
        filename: "1.0.0.patch",
        hash: "patchHash",
        version: "1.0.0",
        notes: "patch_notes",
        size: 1024,
        url: "PUBLIC_URL/1.0.0.patch",
      });
    });

    it("formats full file", () => {
      expect(
        getUpdateEntryFetchInfo(
          {
            fullHash: "fullHash",
            notes: "full_notes",
            size: 4096,
            version: "2.0.0",
          } as PatchEntry,
          false,
          "PUBLIC_URL",
        ),
      ).toEqual<UpdateEntry>({
        filename: "2.0.0.packed.7z",
        hash: "fullHash",
        version: "2.0.0",
        notes: "full_notes",
        size: 4096,
        url: "PUBLIC_URL/2.0.0.packed.7z",
      });
    });
  });
});