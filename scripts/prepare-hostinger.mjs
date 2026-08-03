import { access, cp, mkdir } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const standaloneRoot = resolve(projectRoot, ".next/standalone");
const serverEntry = resolve(standaloneRoot, "server.js");

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

console.log("Prepared Hostinger standalone server with public and static assets.");
