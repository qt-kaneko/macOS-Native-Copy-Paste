## About
This extension replaces default Command+C and Command+V in file explorer panel so you can copy/paste files from other applications, like Finder.
### Without extension
![image](/assets/without.gif)
### With extension
![image](/assets/with.gif)

## Cut
Cut is not supports, so Command+X will just run default VSCodes cut implementation.

## Other OS
Extension uses default VSCodes copy/paste implementation on OS other than macOS.

## Known problems
- If root (workspace) folder is selected and any file opened, clipboard will be pasted to opened file location rather than to root (workspace) folder, so select any file in root (workspace) folder to paste clipboard content to root (workspace) folder. This is due to limitation of VSCode API, if you have any suggestions, contribute them to https://github.com/qt-kaneko/macOS-Native-Copy-Paste/issues/1.

- Native multi-file copy is not supported.