import * as vscode from "vscode";
import * as url from "node:url";
import { jxa } from "jxa";

declare const ObjC: any;
declare const $: any;

export async function activate({subscriptions}: vscode.ExtensionContext)
{
  subscriptions.push(
    vscode.commands.registerCommand(`macos-native-copy-paste.copyFile`, copyFile),
    vscode.commands.registerCommand(`macos-native-copy-paste.pasteFile`, pasteFile)
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

async function getExplorerSelection()
{
  clearClipboard();

  await vscode.commands.executeCommand(`workbench.action.newGroupBelow`);
  await vscode.commands.executeCommand(`copyFilePath`);
  await vscode.commands.executeCommand(`workbench.action.closeGroup`);
  let selectionClipboard = await vscode.env.clipboard.readText();

  if (selectionClipboard === ``)
  {
    selectionClipboard = vscode.workspace.workspaceFolders![0].uri.fsPath;
  }

  let selection = selectionClipboard.split(`\n`)
                                    .map(vscode.Uri.file);

  await vscode.commands.executeCommand(`revealInExplorer`, selection[0]);

  return selection;
}

async function pasteFile()
{
  let workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (workspaceFolder == null) return;

  // let clipboardFiles = getClipboardFiles();
  // if (clipboardFiles.length === 0) return;

  let selection = await getExplorerSelection();
  console.log(selection.map(s => s.path));

  // let clipboard = await vscode.env.clipboard.readText();

  // let copyFilePathResult = await vscode.env.clipboard.readText();

  // let selection = clipboard !== copyFilePathResult // If workspace root is selected, clipboard content doesn't change
  //               ? vscode.Uri.parse(copyFilePathResult)
  //               : vscode.workspace.workspaceFolders[0].uri;

  // let directory = (await vscode.workspace.fs.stat(selection)).type === vscode.FileType.File
  //               ? vscode.Uri.parse(new PathBuilder(selection.fsPath).directory)
  //               : selection;

  // let directoryContent = (await vscode.workspace.fs.readDirectory(directory))
  //                                               .map(([name, type]) => name);

  // for (let targetFullPath of inClipboard)
  // {
  //   let targetPath = new PathBuilder(targetFullPath.replace(/\/$/, ``));
  //   let target = targetPath.target;

  //   for (let copyI = 1; directoryContent.includes(target); ++copyI)
  //   {
  //     target = targetPath.targetName
  //           + (copyI > 1 ? ` copy ${copyI}` : ` copy`)
  //           + targetPath.targetExtension;
  //   }

  //   await vscode.workspace.fs.copy(
  //     vscode.Uri.parse(targetPath.toString()),
  //     vscode.Uri.joinPath(directory, target)
  //   );

  //   directoryContent.push(target);
  // }

  // setClipboardFiles(inClipboard);
}

function getClipboardFiles()
{
  let files = jxa([], () => {
    ObjC.import('AppKit');

    let pasteboard = $.NSPasteboard.generalPasteboard;
    let classes = $([$.NSURL]);
    let options = $({
      [$.NSPasteboardURLReadingFileURLsOnlyKey]: $.NSPasteboardReadingAsData
    });
    let objects = pasteboard.readObjectsForClassesOptions(classes, options).js
                            .map(object => object.absoluteString.js);

    return objects as string[];
  });
  return files;
}
function setClipboardFiles(files: string[])
{
  jxa([files], (urls: string[]) => {
    ObjC.import('AppKit');

    let pasteboard = $.NSPasteboard.generalPasteboard;
    let objects = $(urls.map(url => $.NSURL.URLWithString($(url))));
    pasteboard.clearContents;
    pasteboard.writeObjects(objects);
  });
}
function clearClipboard()
{
  jxa([], () => {
    ObjC.import('AppKit');

    let pasteboard = $.NSPasteboard.generalPasteboard;
    pasteboard.clearContents;
  });
}