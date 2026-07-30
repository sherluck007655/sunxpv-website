import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { tmpdir } from "node:os";

const entryPath = resolve("dist/standalone/server.cjs");
const host = "127.0.0.1";
const port = await availablePort();
const baseUrl = `http://${host}:${port}`;
const output = [];

const child = spawn(
  process.execPath,
  ["--eval", `require(${JSON.stringify(entryPath)})`],
  {
    cwd: tmpdir(),
    env: {
      ...process.env,
      HOST: host,
      PORT: String(port),
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

child.stdout.on("data", (chunk) => output.push(String(chunk)));
child.stderr.on("data", (chunk) => output.push(String(chunk)));

try {
  await waitUntilReady(`${baseUrl}/`);

  for (const pathname of [
    "/",
    "/api/public/content",
    "/robots.txt",
    "/images/sunx-logo.png",
  ]) {
    const response = await fetch(`${baseUrl}${pathname}`);
    if (response.status !== 200) {
      throw new Error(
        `Hostinger runtime check failed for ${pathname}: HTTP ${response.status}`,
      );
    }
  }
} catch (error) {
  console.error(output.join(""));
  throw error;
} finally {
  child.kill("SIGTERM");
}

console.log(
  "Validated Hostinger runtime: Passenger-style require starts server.cjs and public routes return HTTP 200.",
);

function availablePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, host, () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Unable to reserve a local validation port"));
        return;
      }
      const selectedPort = address.port;
      server.close((error) => {
        if (error) reject(error);
        else resolvePort(selectedPort);
      });
    });
  });
}

async function waitUntilReady(url) {
  const deadline = Date.now() + 5_000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(
        `Hostinger runtime exited before listening with code ${child.exitCode}`,
      );
    }

    try {
      const response = await fetch(url);
      if (response.status === 200) return;
    } catch {
      // The server is still starting.
    }

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
  }

  throw new Error("Hostinger runtime did not listen within 5 seconds");
}
