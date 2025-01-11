// SPDX-FileCopyrightText: 2024 Aljebriq <143266740+aljebriq@users.noreply.github.com>
// SPDX-FileCopyrightText: 2024 Łukasz Bartkiewicz <lukasku@proton.me>
//
// SPDX-License-Identifier: GPL-3.0-only

import { context } from "esbuild";

const production = process.argv.includes("--production");

async function main() {
  const ctx = await context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "node",
    outfile: "dist/extension.js",
    external: ["vscode"],
  });

  await ctx.rebuild();
  await ctx.dispose();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
