import { register } from "node:module";

register("./cloudflare-worker-loader.mjs", import.meta.url);
await import("./vinext-server.mjs");
