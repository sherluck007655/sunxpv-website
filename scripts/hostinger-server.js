void (async () => {
  const { register } = await import("node:module");
  const { pathToFileURL } = await import("node:url");

  register(
    "./cloudflare-worker-loader.mjs",
    pathToFileURL(process.argv[1]),
  );
  await import("./vinext-server.mjs");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
