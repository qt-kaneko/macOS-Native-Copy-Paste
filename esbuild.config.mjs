import * as esbuild from "esbuild";
import { copy } from "@qt-kaneko/esbuild-copy";

let args = process.argv.slice(2);
let configuration = args[0];

/** @type {Record<string, esbuild.BuildOptions>} */
let options = {
  [`default`]: {
    bundle: true,
    platform: `node`,
    entryPoints: [
      `src/main.ts`
    ],
    external: [
      `vscode`
    ],
    outdir: `dist`,
    plugins: [
      copy([
        `assets/icon.png`,
        `assets/package.json`,
        `README.md`,
        `LICENSE.txt`
      ])
    ]
  },
  [`Debug`]: {
    sourcemap: true
  },
  [`Release`]: {
    minifyWhitespace: true
  }
};

await esbuild.build({
  ...options[`default`],
  ...options[configuration]
});