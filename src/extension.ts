import * as vsc from "vscode";
import * as cp from "child_process";

export async function activate({subscriptions}: vsc.ExtensionContext)
{
  let copyFile = vsc.commands.registerCommand(`macos-native-copy-paste.copyFile`, async () => {
    if (process.platform !== `darwin`)
    {
      vsc.commands.executeCommand(`fileExplorer.copy`);
      return;
    }

    await vsc.commands.executeCommand(`copyFilePath`);

    cp.execSync(`osascript -e 'set the clipboard to (the clipboard as «class furl»)'`);
  });
  subscriptions.push(copyFile);

  let pasteFile = vsc.commands.registerCommand(`macos-native-copy-paste.pasteFile`, async () => {
    if (vsc.workspace.workspaceFolders == null) return;

    if (process.platform !== `darwin`)
    {
      vsc.commands.executeCommand(`fileExplorer.paste`);
      return;
    }

    let containsFile = cp.execSync(`osascript -e '((clipboard info) as string) contains "«class furl»"'`)
                         .toString()
                         .trimEnd();
    if (containsFile === `false`) return;

    let filePath = cp.execSync(`osascript -e 'POSIX path of (the clipboard as «class furl»)'`)
                     .toString()
                     .trimEnd()

    let fileName = filePath.replace(/\/$/, ``).match(/.*\/(.*)/)![1];

    let previousClipboard = await vsc.env.clipboard.readText();

    await vsc.commands.executeCommand(`copyFilePath`);
    let currentClipboard = await vsc.env.clipboard.readText();

    let selection = previousClipboard !== currentClipboard // If workspace root is selected, clipboard content doesn't change
                  ? vsc.Uri.parse(currentClipboard)
                  : vsc.workspace.workspaceFolders[0].uri;

    let directory = (await vsc.workspace.fs.stat(selection)).type === vsc.FileType.File
                  ? selection.with({path: selection.fsPath.match(/(.*\/)/)![1]})
                  : selection;

    await vsc.workspace.fs.copy(
      vsc.Uri.parse(filePath),
      vsc.Uri.joinPath(directory, fileName)
    );

    cp.execSync(`osascript -e 'set the clipboard to ("${filePath}" as «class furl»)'`);
  });
  subscriptions.push(pasteFile);
}