// generate a file with random data run in the terminal
// node -e "process.stdout.write(crypto.randomBytes(1e9))" > big.file
import { Readable, Transform, TransformCallback } from "node:stream";
import http, { IncomingMessage, OutgoingMessage } from "node:http";
import { createReadStream } from "node:fs";
import { randomUUID } from "node:crypto";

function* run() {
  for (let index = 0; index < 99; index++) {
    yield {
      id: randomUUID(),
      date: Date.now(),
    };
  }
}

const CreateYourOwnDataHandler = (
  req: IncomingMessage,
  res: OutgoingMessage
) => {
  new Readable({
    read() {
      for (const data of run()) {
        this.push(JSON.stringify(data).concat("\n"));
      }
    },
  })
    .pipe(res)
    .on("finish", () => {
      console.log("reading file done");
    });
};

// if we wanna read from a file
const ReadFromFileHnadler = (req: IncomingMessage, res: OutgoingMessage) => {
  // the "new Transform" is just to show that you can create
  // as many pipes as you want and chnage your data as you want
  createReadStream("data.text")
    .pipe(
      new Transform({
        objectMode: true,
        transform(
          chunk: any,
          enc: BufferEncoding,
          callback: TransformCallback
        ) {
          return callback(null, JSON.stringify(chunk.toString()));
        },
      })
    )
    .pipe(res)
    .on("finish", () => {
      console.log("reading file done");
    });
};

http
  .createServer(ReadFromFileHnadler)
  .listen(3000)
  .on("listening", () => console.log("listening on 3000"));
