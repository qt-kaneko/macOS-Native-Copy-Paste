// @ts-check
import * as fs from "fs";
import * as fsp from "fs/promises";
import * as cp from "child_process";

// CONFIG
const INCLUDE = [`package.json`, `LICENSE.txt`, `README.md`, `assets/icon.png`];
const DESTINATION = `dist`;

let isRelease = process.argv.includes(`release`);

if (!fs.existsSync(`node_modules`))
{
  await spawnAsync(`npm`, [`install`], {stdio: `inherit`})
}

if (isRelease)
{
  await Promise.all([
    spawnAsync(`tsc`, [`--build`, `--clean`, `tsconfig.json`], {stdio: `inherit`}),
    spawnAsync(`tsc`, [`--build`, `--clean`, `tsconfig.release.json`], {stdio: `inherit`}),
    fsp.rm(DESTINATION, {recursive: true, force: true})
  ]);
}

let copyIncludes = INCLUDE.map(includeItem =>
  fsp.cp(includeItem, DESTINATION + `/` + includeItem, {recursive: true})
);

let build = spawnAsync(
  `tsc`,
  [`--build`, (isRelease ? `tsconfig.release.json` : `tsconfig.json`)],
  {stdio: `inherit`}
);
build = build.then(code => process.exitCode = code ?? -1);

await Promise.all([...copyIncludes, build]);

/**
 * @param {string} command 
 * @param {readonly string[]} args
 * @param {cp.SpawnSyncOptions} options
 * @returns {Promise<number|null>}
 */
function spawnAsync(command, args, options)
{
  return new Promise(resolve =>
    cp.spawn(command, args, options)
      .on(`exit`, code => resolve(code))
  );
}