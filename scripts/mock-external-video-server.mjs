// Serves public/sample-dds.mp4 on its own port (different origin than the
// Next.js app) with Range-request support, to simulate a video hosted on an
// external CDN. Native <video> playback events (timeupdate/seeking/ended)
// aren't subject to CORS, so DDS progress tracking works the same either way
// — this server exists to demonstrate that, not because CORS headers are
// required for it to work.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "sample-dds.mp4");
const PORT = process.env.PORT ? Number(process.env.PORT) : 4321;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Range");
  res.setHeader("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
  const start = parseInt(startStr, 10);
  const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
  const chunkSize = end - start + 1;

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "video/mp4",
  });
  fs.createReadStream(filePath, { start, end }).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Mock external video CDN running at http://localhost:${PORT}/sample-dds.mp4`);
});
