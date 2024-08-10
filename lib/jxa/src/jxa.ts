import * as cp from "node:child_process";

import { Stringifyable } from "./Stringifyable";

export function
  jxa
  <TArgs extends Stringifyable[], TReturn extends Stringifyable | void>
  (args: TArgs, code: (...args: TArgs) => TReturn)
{
  let codeString = code.toString();
  let argsString = JSON.stringify(args);
  let iifeString = `(${codeString}).apply(null, ${argsString})`;
  // let returnString = `JSON.stringify(${iifeString})`;

  let result = cp.spawnSync(`/usr/bin/osascript`, [`-l`, `JavaScript`, `-s`, `s`, `-e`, iifeString]);
  if (result.stderr.length > 0)
  {
    let message = result.stderr.toString();
    throw new Error(message);
  }

  let returnString = result.stdout.toString();
  let returnValue = returnString === ``
                  ? undefined
                  : JSON.parse(returnString);
  return returnValue as TReturn;
}