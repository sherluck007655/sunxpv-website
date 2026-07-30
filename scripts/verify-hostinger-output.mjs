import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const hostingerEntry = resolve("dist/standalone/server.js");
const standaloneServer = resolve("dist/standalone/vinext-server.mjs");
const cloudflareLoader = resolve(
  "dist/standalone/cloudflare-worker-loader.mjs",
);
const hostingerPackage = resolve("dist/standalone/package.json");
const vinextPackage = resolve("dist/standalone/dist/package.json");

try {
  await Promise.all(
    [
      standaloneServer,
      hostingerEntry,
      cloudflareLoader,
      hostingerPackage,
      vinextPackage,
    ].map((file) => access(file, constants.R_OK)),
  );
} catch {
  console.error(
    "Missing Hostinger output files in dist/standalone",
  );
  process.exit(66);
}

const packageMetadata = JSON.parse(
  await readFile(hostingerPackage, "utf8"),
);
const vinextPackageMetadata = JSON.parse(
  await readFile(vinextPackage, "utf8"),
);

if (packageMetadata.type !== "commonjs") {
  console.error("Hostinger entry must be loaded as CommonJS");
  process.exit(66);
}

if (vinextPackageMetadata.type !== "module") {
  console.error("Vinext runtime must remain ESM");
  process.exit(66);
}

console.log(
  "Validated Hostinger output: CommonJS dist/standalone/server.js is ready.",
);
