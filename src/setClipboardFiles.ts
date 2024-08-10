import { jxa } from "jxa";

declare const ObjC: any;
declare const $: any;

export function setClipboardFiles(files: string[])
{
  jxa([files], (urls: string[]) => {
    ObjC.import('AppKit');

    let pasteboard = $.NSPasteboard.generalPasteboard;
    let objects = $(urls.map(url => $.NSURL.URLWithString($(url))));
    pasteboard.clearContents;
    pasteboard.writeObjects(objects);
  });
}