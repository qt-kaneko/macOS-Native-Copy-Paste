import * as cp from "child_process";

import { Stringifyable } from "./Stringifyable";

export async function
  jxa
  <TArgs extends Stringifyable[], TReturn extends Stringifyable | void>
  (args: TArgs, code: (...args: TArgs) => TReturn)
{
  let codeString = code.toString();
  let argsString = JSON.stringify(args);
  let iifeString = `(${codeString}).apply(null, ${argsString})`;
  // let returnString = `JSON.stringify(${iifeString})`;

  let process = cp.spawn(`/usr/bin/osascript`, [`-l`, `JavaScript`, `-s`, `s`, `-e`, iifeString]);

  let stderr = ``;
  process.stderr.setEncoding(`utf8`);
  process.stderr.addListener(`data`, data => stderr += data);

  let stdout = ``;
  process.stdout.setEncoding(`utf8`);
  process.stdout.addListener(`data`, data => stdout += data);

  await new Promise(resolve => process.addListener(`exit`, resolve));

  if (stderr.length > 0)
  {
    let message = stderr;
    throw new Error(message);
  }

  let returnString = stdout;
  let returnValue = returnString === ``
                  ? undefined
                  : JSON.parse(returnString);
  return returnValue as TReturn;
}