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
//    $ npm install --global img-src-placeholder
//    $ img-src-placeholder src/web docs --quiet
//
// Contributors to this project:
//    $ cd img-src-placeholder
//    $ npm install
//    $ npm test
//    $ node bin/cli.js --cd=spec/fixtures source target/cd --summary

// Imports
import { cliArgvUtil } from 'cli-argv-util';
import { imgSrcPlaceholder } from '../dist/img-src-placeholder.js';
import chalk from 'chalk';
import fs    from 'fs';
import log   from 'fancy-log';
import path  from 'path';

// Parameters and flags
const validFlags = ['cd', 'ext', 'note', 'quiet', 'summary'];
const cli =        cliArgvUtil.parse(validFlags);
const source =     cli.params[0];  //origin file or folder
const target =     cli.params[1];  //destination folder

// Reporting
const printReport = (results) => {
   const name =      chalk.gray('img-src-placeholder');
   const source =    chalk.blue.bold(results.source);
   const target =    chalk.magenta(results.target);
   const arrow =     { big: chalk.gray.bold(' ⟹  '), little: chalk.gray.bold('→') };
   const infoColor = results.count ? chalk.white : chalk.red.bold;
   const info =      infoColor(`(files: ${results.count}, ${results.duration}ms)`);
   const logFile =   (file) => log(name, chalk.white(file.origin), arrow.little, chalk.green(file.dest));
   log(name, source, arrow.big, target, info);
   if (!cli.flagOn.summary)
      results.files.forEach(logFile);
   };

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
   printReport(results);
