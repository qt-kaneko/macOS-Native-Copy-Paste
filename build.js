(async function() { "use strict";

var process = require("process");
var child_process = require(`child_process`);
var fs = require(`fs/promises`);

let include = [`package.json`, `LICENSE`, `README.md`, `ICON.png`];
let destination = `dist`;

await Promise.all([
  ...include.map(includeItem =>
    fs.cp(includeItem, destination + `/` + includeItem, {recursive: true})
  ),
  new Promise(resolve => {
    let process = child_process.spawn(`tsc`, {stdio: `inherit`});
    process.addListener(`exit`, resolve);
  })
]);

})();