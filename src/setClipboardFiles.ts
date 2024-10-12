import { jxa } from "@qt-kaneko/jxa";

declare const ObjC: any;
declare const $: any;

export async function setClipboardFiles(files: string[])
{
  await jxa([files], (urls: string[]) => {
    ObjC.import('AppKit');

    let pasteboard = $.NSPasteboard.generalPasteboard;
    let objects = $(urls.map(url => $.NSURL.URLWithString($(url))));
    pasteboard.clearContents;
    pasteboard.writeObjects(objects);
  });
}