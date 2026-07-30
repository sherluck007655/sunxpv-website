import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const bundlePath = resolve("dist/standalone/dist/server/index.js");
const cloudflareImport = 'import { env } from "cloudflare:workers";';
const hostingerEnvironment = "const env = Object.create(null);";

const bundle = await readFile(bundlePath, "utf8");
const importCount = bundle.split(cloudflareImport).length - 1;

if (importCount !== 1) {
  console.error(
    `Expected one Cloudflare environment import in ${bundlePath}, found ${importCount}`,
  );
  process.exit(66);
}

const patchedBundle = bundle.replace(
  cloudflareImport,
  hostingerEnvironment,
);

if (patchedBundle.includes("cloudflare:workers")) {
  console.error(
    `Hostinger bundle still imports cloudflare:workers in ${bundlePath}`,
  );
  process.exit(66);
}

await writeFile(bundlePath, patchedBundle);
console.log(
  "Patched Hostinger server bundle to use a local runtime environment.",
);
