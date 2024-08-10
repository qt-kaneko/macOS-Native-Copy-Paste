import * as esbuild from "esbuild";
import * as fs from "fs";
import * as fsp from "fs/promises";
import * as path from "path";

import { raise } from "./raise.js";

/**
 * @param {(string | [string, string])[]} resources
 * @returns {esbuild.Plugin}
 */
export const copy = (resources) => ({
  name: `esbuild-copy`,
  setup(build) {
    build.onEnd(onEnd.bind(this, resources, build));
  }
});

/**
 * @param {(string | [string, string])[]} resources
 * @param {esbuild.PluginBuild} build
 * @param {esbuild.BuildResult} result
 */
async function onEnd(resources, build, result)
{
  let initialOptions = build.initialOptions;
  let outdir = initialOptions.outdir ?? raise(Error, `Outdir must be specified for plugin to work!`);

  await Promise.all(resources.map(async (resource) => {
    let [from, to] = (typeof resource === `string`)
                   ? [resource, path.basename(resource)]
                   : resource;
    to = path.join(outdir, to);

    if (fs.existsSync(to))
    {
      let fromStat = await fsp.stat(from);
      let toStat = await fsp.stat(to);

      if (Math.abs(fromStat.mtimeMs - toStat.mtimeMs) <= 10 &&
          fromStat.size === toStat.size)
      {
        return;
      }
    }

    await fsp.cp(from, to, {
      dereference: true,
      force: true,
      preserveTimestamps: true,
      recursive: true
    });
  }))
}