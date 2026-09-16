import { WebContainer } from "@webcontainer/api";

export async function getWebContainer() {
  return await WebContainer.boot();
}

const webcontainer = await getWebContainer();

webcontainer().mount({
  "index.html": {
    file: {
      contents: "html",
    },
  },

  "style.css": {
    file: {
      contents: "css",
    },
  },

  "script.js": {
    file: {
      contents: "js",
    },
  },

  "server.js": {
    file: {
      contents: `
        const http = require("http");
        const fs = require("fs");
        const path = require("path");

        const server = http.createServer((req, res) => {
          let filePath = req.url === "/"
            ? "./index.html"
            : "." + req.url;

          if (!fs.existsSync(filePath)) {
            res.writeHead(404);
            res.end("Not Found");
            return;
          }

          const ext = path.extname(filePath);

          const types = {
            ".html": "text/html",
            ".css": "text/css",
            ".js": "text/javascript",
          };

          res.writeHead(200, {
            "Content-Type": types[ext] || "text/plain",
          });

          fs.createReadStream(filePath).pipe(res);
        });

        server.listen(3000, "0.0.0.0");
      `,
    },
  },
});

await webcontainer.spawn("npx", ["serve", ".", "-l", "3000"]);
