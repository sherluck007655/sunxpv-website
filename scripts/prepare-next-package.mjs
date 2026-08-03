import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const packagePath = resolve(process.cwd(), "package.json");
const packageJson = JSON.parse(await readFile(packagePath, "utf8"));

delete packageJson.type;

await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
