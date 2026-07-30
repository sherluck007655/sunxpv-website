const { register } = require("node:module");
const { pathToFileURL } = require("node:url");

register("./cloudflare-worker-loader.mjs", pathToFileURL(__filename));

void import("./vinext-server.mjs").catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
