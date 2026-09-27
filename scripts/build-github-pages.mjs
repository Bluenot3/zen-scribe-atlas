import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Build a temporary copy so the published Sites source stays byte-for-byte intact.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stage = path.join(root, ".sites-runtime", "github-pages");
const output = path.join(root, "out");
const basePath = process.env.PAGES_BASE_PATH ?? "/zen-scribe-atlas";
if (basePath && !/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(basePath)) {
  throw new Error("PAGES_BASE_PATH must be empty or a slash-prefixed repository path.");
}
for (const directory of [stage, output]) {
  if (!directory.startsWith(root + path.sep)) throw new Error("Invalid build directory.");
  rmSync(directory, { recursive: true, force: true });
}
mkdirSync(stage, { recursive: true });
for (const item of ["app", "components", "hooks", "lib", "vendor", "public", "package.json", "tsconfig.json", "postcss.config.mjs"]) {
  cpSync(path.join(root, item), path.join(stage, item), { recursive: true });
}

// GitHub project sites live below /repository/. Adjust asset URLs only in the
// generated build copy; proposal text, styles, interactions and assets are unchanged.
const publicFiles = readdirSync(path.join(stage, "public"), { recursive: true, withFileTypes: true })
  .filter(entry => entry.isFile())
  .map(entry => "/" + path.relative(path.join(stage, "public"), path.join(entry.parentPath, entry.name)).split(path.sep).join("/"));
for (const entry of readdirSync(path.join(stage, "app"), { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !/\.(tsx?|css)$/.test(entry.name)) continue;
  const filename = path.join(entry.parentPath, entry.name);
  let content = readFileSync(filename, "utf8");
  for (const asset of publicFiles) content = content.replaceAll(asset, `${basePath}${asset}`);
  writeFileSync(filename, content);
}
writeFileSync(path.join(stage, "next.config.mjs"), `export default ${JSON.stringify({
  output: "export", basePath, trailingSlash: true,
  images: { unoptimized: true },
  experimental: { cpus: 2 },
})};\n`);
const result = spawnSync(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"], {
  cwd: stage, stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
cpSync(path.join(stage, "out"), output, { recursive: true });
writeFileSync(path.join(output, ".nojekyll"), "");
const html = readFileSync(path.join(output, "index.html"), "utf8");
for (const asset of publicFiles) {
  if (!html.includes(`${basePath}${asset}`)) throw new Error(`Missing asset reference: ${asset}`);
  if (!readFileSync(path.join(root, "public", asset.slice(1))).equals(readFileSync(path.join(output, asset.slice(1))))) {
    throw new Error(`Asset changed during export: ${asset}`);
  }
}
console.log(`GitHub Pages export verified: ${output} (base path: ${basePath || "/"})`);
