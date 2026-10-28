const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".png": "image/png",
};

function serveFile(target, request, response) {
  fs.stat(target, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(error && error.code === "ENOENT" ? 404 : 500);
      response.end(error && error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    const headers = {
      "Accept-Ranges": "bytes",
      "Content-Type": contentTypes[path.extname(target).toLowerCase()] ?? "application/octet-stream",
    };
    const range = request.headers.range;
    const match = typeof range === "string" ? /^bytes=(\d*)-(\d*)$/.exec(range) : null;

    if (match) {
      const size = stats.size;
      let start;
      let end;

      if (match[1] === "") {
        const suffixLength = Number(match[2]);
        if (suffixLength > 0) {
          start = Math.max(size - suffixLength, 0);
          end = size - 1;
        }
      } else {
        start = Number(match[1]);
        end = match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
      }

      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || end < start) {
        response.writeHead(416, {
          "Accept-Ranges": "bytes",
          "Content-Range": `bytes */${size}`,
        });
        response.end();
        return;
      }

      headers["Content-Length"] = end - start + 1;
      headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
      response.writeHead(206, headers);
      if (request.method === "HEAD") {
        response.end();
        return;
      }

      const stream = fs.createReadStream(target, { start, end });
      stream.on("error", streamError => response.destroy(streamError));
      stream.pipe(response);
      return;
    }

    headers["Content-Length"] = stats.size;
    response.writeHead(200, headers);
    if (request.method === "HEAD") {
      response.end();
      return;
    }

    const stream = fs.createReadStream(target);
    stream.on("error", streamError => response.destroy(streamError));
    stream.pipe(response);
  });
}

const server = http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  const filePath = path.resolve(root, `.${pathname}`);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  const target = filePath === root ? path.join(root, "index.html") : filePath;
  serveFile(target, request, response);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("COVA site available at http://127.0.0.1:8000");
});
