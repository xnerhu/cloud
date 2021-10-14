import sevenBin from "7zip-bin";
import { extractFull } from "node-7z";

export const unpack7z = (
  src: string,
  dst: string,
  onProgress?: (percent: number) => void,
) => {
  return new Promise<void>((resolve, reject) => {
    const pathTo7zip = sevenBin.path7za;
    const seven = extractFull(src, dst, {
      $bin: pathTo7zip,
      $progress: onProgress != null,
    });

    seven.on("progress", (e) => {
      onProgress?.(e.percent);
    });

    seven.once("error", (err: Error) => {
      reject(err);
    });

    seven.once("end", () => {
      resolve();
    });
  });
};
