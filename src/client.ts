import { createWriteStream } from "fs";
import { get, IncomingMessage } from "http";

const getHttpStream = (): Promise<IncomingMessage> => {
  return new Promise((resolve) =>
    get("http://localhost:3000", (res) => resolve(res))
  );
};

(async () => {
  const stream: IncomingMessage = await getHttpStream();
  stream.pipe(createWriteStream("output.text"));
})();
