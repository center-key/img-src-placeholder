# img-src-placeholder
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_Replace `src=#` in `<img>` tags of HTML files with an inline data URL of a transparent 1 pixel image (CLI tool designed for use in npm scripts)_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/img-src-placeholder/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/img-src-placeholder.svg)](https://www.npmjs.com/package/img-src-placeholder)
[![Vulnerabilities](https://snyk.io/test/github/center-key/img-src-placeholder/badge.svg)](https://snyk.io/test/github/center-key/img-src-placeholder)
[![Build](https://github.com/center-key/img-src-placeholder/workflows/build/badge.svg)](https://github.com/center-key/img-src-placeholder/actions/workflows/run-spec-on-push.yaml)

**img-src-placeholder** solves the trickly little problem that valid HTML requires that all `<img>` tags
have a `src` attribute, even if your web application sets the `src` attribute dynamically.

This tool transforms:
```html
<img src=# alt=avatar>
```
into:
```html
<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg=="
   alt=avatar>
```

<img src=https://raw.githubusercontent.com/center-key/img-src-placeholder/main/screenshot.png
width=800 alt=screenshot>

## A) Setup
Install package for node:
```shell
$ npm install --save-dev img-src-placeholder
```

## B) Usage
### 1. npm scripts
Run `img-src-placeholder` from the `"scripts"` section of your **package.json** file.

Parameters:
* The **first** parameter is the *source* folder or file.
* The **second** parameter is the *target* folder.

Example **package.json** scripts:
```json
   "scripts": {
      "stage-web": "img-src-placeholder src/web build/website",
   },
```

### 2. Global
You can install **img-src-placeholder** globally and then run it anywhere directly from the terminal.

Example terminal commands:
```shell
$ npm install --global img-src-placeholder
$ img-src-placeholder src/web ext=.html docs/api-manual
```

### 3. CLI Flags
Command-line flags:
| Flag            | Description                                      | Value      |
| --------------- | ------------------------------------------------ | ---------- |
| `--cd`          | Change working directory before starting search. | **string** |
| `--ext`         | Filter files by file extension, such as `.html`.<br>Use a comma to specify multiple extensions. | **string** |
| `--note`        | Place to add a comment only for humans.          | **string** |
| `--quiet`       | Suppress informational messages.                 | N/A        |
| `--summary`     | Only print out the single line summary message.  | N/A        |

The default value for `--ext` is: `".html,.htm,.php,.aspx,.asp,.jsp"`

### 4. Example CLI Usage
Examples:
   - `img-src-placeholder src/web build/website`<br>
   Recursively copy all HTML files in the **src/web** folder to the **build/website** folder and replace the "hash" placeholder image sources with an inline data URL for a transparent 1 pixel image.
   - `img-src-placeholder src/web build/website --summary`<br>
   Display the summary but not the individual files copied.
   - `img-src-placeholder src/web build/website --ext=.php`<br>
   Only process PHP files.

## C) Application Code
Even though **img-src-placeholder** is primarily intended for build scripts, the package can easily be used programmatically in ESM and TypeScript projects.

Example:
``` typescript
import { imgSrcPlaceholder } from 'img-src-placeholder';
const options = { extensions: ['.html'] };
const results = imgSrcPlaceholder.transform('src/web', 'build', options);
console.log('Number of files copied:', results.count);
```

See the **TypeScript Declarations** at the top of [img-src-placeholder.ts](img-src-placeholder.ts) for documentation.

## D) Under the Hood
The data URL is created by **Base64** encoding a super simple `<svg>` string:
```javascript
const onePixelSvg =
   '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>';
const dataImage = 'data:image/svg+xml;base64,' +
   Buffer.from(onePixelSvg).toString('base64');
```

<br>

---
**CLI Build Tools**
   - 🎋 [add-dist-header](https://github.com/center-key/add-dist-header):&nbsp; _Prepend a one-line banner comment (with license notice) to distribution files_
   - 📄 [copy-file-util](https://github.com/center-key/copy-file-util):&nbsp; _Copy or rename a file with optional package version number_
   - 📂 [copy-folder-util](https://github.com/center-key/copy-folder-util):&nbsp; _Recursively copy files from one folder to another folder_
   - 🔍 [img-src-placeholder](https://github.com/center-key/img-src-placeholder):&nbsp; _Find and replace strings or template outputs in text files_
   - 🔢 [rev-web-assets](https://github.com/center-key/rev-web-assets):&nbsp; _Revision web asset filenames with cache busting content hash fingerprints_
   - 🚆 [run-scripts-util](https://github.com/center-key/run-scripts-util):&nbsp; _Organize npm scripts into named groups of easy to manage commands_
   - 🚦 [w3c-html-validator](https://github.com/center-key/w3c-html-validator):&nbsp; _Check the markup validity of HTML files using the W3C validator_

Feel free to submit questions at:<br>
[github.com/center-key/img-src-placeholder/issues](https://github.com/center-key/img-src-placeholder/issues)

[MIT License](LICENSE.txt)
