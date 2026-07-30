import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const standaloneServer = resolve("dist/standalone/server.js");
const hostingerEntry = resolve("dist/standalone/hostinger-server.mjs");
const cloudflareLoader = resolve(
  "dist/standalone/cloudflare-worker-loader.mjs",
);

try {
  await Promise.all(
    [standaloneServer, hostingerEntry, cloudflareLoader].map((file) =>
      access(file, constants.R_OK),
    ),
  );
} catch {
  console.error(
    "Missing Hostinger output files in dist/standalone",
  );
  process.exit(66);
}

console.log(
  "Validated Hostinger output: dist/standalone/hostinger-server.mjs is ready.",
);
