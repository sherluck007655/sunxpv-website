import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const standaloneRoot = resolve(projectRoot, ".next/standalone");
const serverEntry = resolve(standaloneRoot, "server.js");
const standalonePackagePath = resolve(standaloneRoot, "package.json");
const compatibleOutput = resolve(projectRoot, "dist/standalone");

await access(serverEntry, constants.R_OK);
await mkdir(resolve(standaloneRoot, ".next"), { recursive: true });
await cp(resolve(projectRoot, ".next/static"), resolve(standaloneRoot, ".next/static"), {
  recursive: true,
  force: true,
});
await cp(resolve(projectRoot, "public"), resolve(standaloneRoot, "public"), {
  recursive: true,
  force: true,
});

const standalonePackage = JSON.parse(
  await readFile(standalonePackagePath, "utf8"),
);
standalonePackage.type = "commonjs";
standalonePackage.scripts = {
  ...(standalonePackage.scripts || {}),
  start: "node server.js",
};
await writeFile(
  standalonePackagePath,
  `${JSON.stringify(standalonePackage, null, 2)}\n`,
);

await rm(compatibleOutput, { recursive: true, force: true });
await mkdir(resolve(projectRoot, "dist"), { recursive: true });
await cp(standaloneRoot, compatibleOutput, {
  recursive: true,
  force: true,
});
await access(resolve(compatibleOutput, "server.js"), constants.R_OK);

console.log(
  "Prepared CommonJS Hostinger servers in .next/standalone and dist/standalone.",
);
