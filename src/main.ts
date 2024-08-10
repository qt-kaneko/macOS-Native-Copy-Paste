import * as vscode from "vscode";
import * as url from "url";

import { setClipboardFiles } from "./setClipboardFiles";

export async function activate({subscriptions}: vscode.ExtensionContext)
{
  subscriptions.push(
    vscode.commands.registerCommand(`macos-native-copy-paste.copyFile`, copyFile)
  );
}

async function copyFile()
{
  await vscode.commands.executeCommand(`copyFilePath`);
  let selection = await vscode.env.clipboard.readText();
  let paths = selection.split(/[\r\n]/);
  let urls = paths.map(path => url.pathToFileURL(path).href);

  setClipboardFiles(urls);
}