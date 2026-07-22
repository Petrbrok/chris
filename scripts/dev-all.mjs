import { spawn } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const processes = [
  spawn(npm, ["run", "dev"], { stdio: "inherit", shell: false }),
  spawn(npm, ["run", "bot"], { stdio: "inherit", shell: false }),
];

function stop() {
  for (const child of processes) child.kill("SIGTERM");
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

await Promise.all(processes.map((child) => new Promise((resolve) => child.on("exit", resolve))));
