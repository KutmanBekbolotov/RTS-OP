const { spawn } = require("child_process");

const electronBinary = require("electron");
const args = process.argv.slice(2);

const rendererUrlArg = args.find((arg) => arg.startsWith("--renderer-url="));
const rendererUrl = rendererUrlArg ? rendererUrlArg.slice("--renderer-url=".length) : undefined;

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

if (rendererUrl) {
  env.ELECTRON_RENDERER_URL = rendererUrl;
}

const child = spawn(electronBinary, ["."], {
  stdio: "inherit",
  env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("Failed to start Electron:", error);
  process.exit(1);
});
