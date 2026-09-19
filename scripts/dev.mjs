import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const production = process.argv.includes("--production");
const python = process.platform === "win32"
  ? path.join(root, ".venv", "Scripts", "python.exe")
  : path.join(root, ".venv", "bin", "python");

if (!existsSync(python)) {
  console.error("Python environment not found. Run: python -m venv .venv");
  process.exit(1);
}

const next = path.join(root, "node_modules", "next", "dist", "bin", "next");
const children = [
  spawn(
    python,
    [
      "-m",
      "uvicorn",
      "backend.app.main:app",
      "--host",
      "127.0.0.1",
      "--port",
      "8000",
      ...(production ? [] : ["--reload"]),
    ],
    { cwd: root, stdio: "inherit" },
  ),
  spawn(process.execPath, [next, production ? "start" : "dev"], {
    cwd: root,
    stdio: "inherit",
  }),
];

let stopping = false;
function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  setTimeout(() => process.exit(exitCode), 250);
}

for (const child of children) {
  child.on("exit", (code) => stop(code ?? 0));
  child.on("error", (error) => {
    console.error(error.message);
    stop(1);
  });
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
