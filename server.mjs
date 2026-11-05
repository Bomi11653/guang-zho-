import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".mp4": "video/mp4", ".webm": "video/webm", ".otf": "font/otf", ".psd": "application/octet-stream", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".zip": "application/zip" };

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const relative = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const file = path.resolve(root, relative);
  if (!file.startsWith(root)) { res.writeHead(403); res.end("Forbidden"); return; }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404); res.end("Not found"); return; }
    const contentType = types[path.extname(file).toLowerCase()] || "application/octet-stream";
    const headers = { "Content-Type": contentType, "Cache-Control": "no-cache", "Accept-Ranges": "bytes" };
    const range = req.headers.range;
    if (!range) {
      headers["Content-Length"] = stat.size;
      res.writeHead(200, headers);
      fs.createReadStream(file).pipe(res);
      return;
    }
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) { res.writeHead(416, { "Content-Range": `bytes */${stat.size}` }); res.end(); return; }
    const start = match[1] ? Number(match[1]) : Math.max(0, stat.size - Number(match[2] || 0));
    const end = match[2] ? Number(match[2]) : stat.size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stat.size) { res.writeHead(416, { "Content-Range": `bytes */${stat.size}` }); res.end(); return; }
    headers["Content-Range"] = `bytes ${start}-${Math.min(end, stat.size - 1)}/${stat.size}`;
    headers["Content-Length"] = Math.min(end, stat.size - 1) - start + 1;
    res.writeHead(206, headers);
    fs.createReadStream(file, { start, end: Math.min(end, stat.size - 1) }).pipe(res);
  });
});

server.listen(port, "127.0.0.1", () => console.log(`Replica preview: http://127.0.0.1:${port}`));
