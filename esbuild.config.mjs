import * as esbuild from "esbuild";
import { copy } from "esbuild-copy";

await esbuild.build({
  bundle: true,
  platform: `node`,
  entryPoints: [
    `src/main.ts`
  ],
  external: [
    `vscode`
  ],
  outdir: `dist`,
  sourcemap: true,
  plugins: [
    copy([
      `assets/icon.png`,
      `assets/package.json`
    ])
  ]
});