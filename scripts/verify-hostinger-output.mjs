import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const hostingerEntry = resolve("dist/standalone/server.cjs");
const compatibilityEntry = resolve("dist/standalone/server.js");
const standaloneServer = resolve("dist/standalone/vinext-server.mjs");
const hostingerBundle = resolve(
  "dist/standalone/dist/server/index.js",
);
const hostingerPackage = resolve("dist/standalone/package.json");
const vinextPackage = resolve("dist/standalone/dist/package.json");

try {
  await Promise.all(
    [
      standaloneServer,
      hostingerEntry,
      compatibilityEntry,
      hostingerBundle,
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
const hostingerBundleSource = await readFile(hostingerBundle, "utf8");
const hostingerEntrySource = await readFile(hostingerEntry, "utf8");

if (packageMetadata.type !== "commonjs") {
  console.error("Hostinger entry must be loaded as CommonJS");
  process.exit(66);
}

if (vinextPackageMetadata.type !== "module") {
  console.error("Vinext runtime must remain ESM");
  process.exit(66);
}

if (hostingerBundleSource.includes("cloudflare:workers")) {
  console.error("Hostinger server bundle must not import cloudflare:workers");
  process.exit(66);
}

if (
  hostingerEntrySource.includes("node:module") ||
  hostingerEntrySource.includes("register(")
) {
  console.error("Hostinger entry must not install an ESM loader");
  process.exit(66);
}

console.log(
  "Validated Hostinger output: loader-free CommonJS server.cjs is ready.",
);
