import * as vsc from "vscode";
import * as cp from "child_process";

import PathBuilder from "./PathBuilder";

export async function activate({subscriptions}: vsc.ExtensionContext)
{
  let copyFile = vsc.commands.registerCommand(`macos-native-copy-paste.copyFile`, async () => {
    if (process.platform !== `darwin`)
    {
      await vsc.commands.executeCommand(`filesExplorer.copy`);
      return;
    }

    await vsc.commands.executeCommand(`copyFilePath`);
    let selection = await vsc.env.clipboard.readText();
    if (selection.split(/[\r\n]/, 2).length > 1)
    {
      // ISSUE: Multiple files copy is not supported yet, fallback to default VSCodes copy implementation
      await vsc.commands.executeCommand(`filesExplorer.copy`);
      return;
    }

    cp.execSync(`osascript -e 'set the clipboard to (the clipboard as «class furl»)'`);
  });
  subscriptions.push(copyFile);

  let pasteFile = vsc.commands.registerCommand(`macos-native-copy-paste.pasteFile`, async () => {
    if (vsc.workspace.workspaceFolders == null) return;

    if (process.platform !== `darwin`)
    {
      await vsc.commands.executeCommand(`filesExplorer.paste`);
      return;
    }

    let previousClipboard = await vsc.env.clipboard.readText();
    if (previousClipboard === ``)
    {
      // When clipboard contains VSCodes file, it returns ''
      await vsc.commands.executeCommand(`filesExplorer.paste`);
      return;
    }

    let containsFile = cp.execSync(`osascript -e '((clipboard info) as string) contains "«class furl»"'`)
                         .toString()
                         .trimEnd();
    if (containsFile === `false`) return;

    let targetFullPath = cp.execSync(`osascript -e 'POSIX path of (the clipboard as «class furl»)'`)
                           .toString()
                           .trimEnd()
    let targetPath = new PathBuilder(targetFullPath.replace(/\/$/, ``));

    await vsc.commands.executeCommand(`copyFilePath`);
    let currentClipboard = await vsc.env.clipboard.readText();

    let selection = previousClipboard !== currentClipboard // If workspace root is selected, clipboard content doesn't change
                  ? vsc.Uri.parse(currentClipboard)
                  : vsc.workspace.workspaceFolders[0].uri;

    let directory = (await vsc.workspace.fs.stat(selection)).type === vsc.FileType.File
                  ? vsc.Uri.parse(new PathBuilder(selection.fsPath).directory)
                  : selection;

    let target = targetPath.target;
    let directoryContent = (await vsc.workspace.fs.readDirectory(directory)).map(([name, type]) => name);
    for (let copyI = 1; directoryContent.includes(target); ++copyI)
    {
      target = targetPath.targetName
             + (copyI > 1 ? ` copy ${copyI}` : ` copy`)
             + targetPath.targetExtension;
    }

    await vsc.workspace.fs.copy(
      vsc.Uri.parse(targetPath.toString()),
      vsc.Uri.joinPath(directory, target)
    );

    cp.execSync(`osascript -e 'set the clipboard to ("${targetPath}" as «class furl»)'`);
  });
  subscriptions.push(pasteFile);
}