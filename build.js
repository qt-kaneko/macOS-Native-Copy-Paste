(async function() { "use strict";

var util = require(`util`);
var process = require("process");
var cp = require(`child_process`);
var fs = require(`fs/promises`);

let release = process.argv.includes(`release`);

let include = [`package.json`, `LICENSE`, `README.md`, `assets/icon.png`];
let destination = `dist`;

if (release)
{
  await Promise.all([
    util.promisify(cp.exec)(`tsc --build --clean tsconfig.json`),
    util.promisify(cp.exec)(`tsc --build --clean tsconfig.release.json`)
  ]);
  await fs.rm(destination, {recursive: true, force: true});
}

await Promise.all([
  ...include.map(includeItem =>
    fs.cp(includeItem, destination + `/` + includeItem, {recursive: true})
  ),
  util.promisify(cp.spawn)(`tsc`, [
    `--build`,
    (release ? `tsconfig.release.json` : `tsconfig.json`)
  ], {stdio: `inherit`})
]);

})();