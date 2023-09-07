#!/usr/bin/env node
/////////////////////////
// img-src-placeholder //
// MIT License         //
/////////////////////////

// Usage in package.json:
//    "scripts": {
//       "stage-web": "img-src-placeholder src/web build/website",
//    },
//
// Usage from command line:
//    $ npm install --save-dev img-src-placeholder
//    $ npx img-src-placeholder src/web docs --quiet
//
// Contributors to this project:
//    $ cd img-src-placeholder
//    $ npm install
//    $ npm test
//    $ node bin/cli.js --cd=spec/fixtures source target/cd --summary

// Imports
import { cliArgvUtil } from 'cli-argv-util';
import { imgSrcPlaceholder } from '../dist/img-src-placeholder.js';
import fs    from 'fs';
import path  from 'path';

// Parameters and flags
const validFlags = ['cd', 'ext', 'note', 'quiet', 'summary'];
const cli =        cliArgvUtil.parse(validFlags);
const source =     cli.params[0];  //origin file or folder
const target =     cli.params[1];  //destination folder

// Transform Files
const error =
   cli.invalidFlag ?     cli.invalidFlagMsg :
   !source ?             'Missing source folder.' :
   !target ?             'Missing target folder.' :
   cli.paramsCount > 2 ? 'Extraneous parameter: ' + cli.params[2] :
   null;
if (error)
   throw Error('[img-src-placeholder] ' + error);
const sourceFile =   path.join(cli.flagMap.cd ?? '', source);
const isFile =       fs.existsSync(sourceFile) && fs.statSync(sourceFile).isFile();
const sourceFolder = isFile ? path.dirname(source) : source;
const options = {
   cd:         cli.flagMap.cd ?? null,
   extensions: cli.flagMap.ext?.split(',') ?? [],
   filename:   isFile ? path.basename(source) : null,
   };
const results = imgSrcPlaceholder.transform(sourceFolder, target, options);
if (!cli.flagOn.quiet)
   imgSrcPlaceholder.reporter(results, { summaryOnly: cli.flagOn.summary });
