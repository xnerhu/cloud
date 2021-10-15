import { Readable, Writable } from "stream";
import axios from "axios";

export const downloadFile = async (url: string, stream: Writable) => {
  const req = await axios({
    method: "get",
    url,
    responseType: "stream",
  });

  const totalBytes = parseInt(req.headers["content-length"]);

  const readable = req.data as Readable;

  readable.pipe(stream);

  return {
    totalBytes,
    stream: readable,
    fetch: () => {
      return new Promise<void>((resolve, reject) => {
        stream.on("finish", () => {
          resolve();
        });

        stream.on("error", (err) => {
          reject(err);
        });
      });
    },
  };
};
