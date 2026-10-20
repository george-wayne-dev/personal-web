import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { resolve, extname, sep } from "node:path";

const root = resolve("out");
const portIndex = process.argv.indexOf("--port");
const port = Number(
  portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || 3000,
);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("端口必须为 1–65535 之间的整数。");
  process.exit(1);
}
if (!existsSync(resolve(root, "index.html"))) {
  console.error("尚无静态构建，请先运行 pnpm build。");
  process.exit(1);
}
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
};
const server = createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
  } catch {
    res.writeHead(400).end("Bad request");
    return;
  }
  const target = resolve(root, `.${pathname}`);
  if (target !== root && !target.startsWith(root + sep)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  const file = [target, `${target}.html`, resolve(target, "index.html")].find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
  );
  const output = file ?? resolve(root, "404.html");
  if (!existsSync(output)) {
    res.writeHead(404).end("Not found");
    return;
  }
  res.writeHead(file ? 200 : 404, {
    "Content-Type":
      (output === resolve(root, "opengraph-image")
        ? "image/png"
        : types[extname(output)]) ?? "application/octet-stream",
    "Content-Length": statSync(output).size,
    "Cache-Control": "no-cache",
  });
  if (req.method === "HEAD") res.end();
  else createReadStream(output).pipe(res);
});
server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () =>
  console.log(`静态预览：http://127.0.0.1:${port}`),
);
