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
import { imgSrcPlaceholder } from '../dist/img-src-placeholder.js';
import chalk from 'chalk';
import fs    from 'fs';
import log   from 'fancy-log';
import path  from 'path';

// Parameters
const validFlags =  ['cd', 'ext', 'note', 'quiet', 'summary'];
const args =        process.argv.slice(2);
const flags =       args.filter(arg => /^--/.test(arg));
const flagMap =     Object.fromEntries(flags.map(flag => flag.replace(/^--/, '').split('=')));
const flagOn =      Object.fromEntries(validFlags.map(flag => [flag, flag in flagMap]));
const invalidFlag = Object.keys(flagMap).find(key => !validFlags.includes(key));
const params =      args.filter(arg => !/^--/.test(arg));

// Data
const source = params[0];  //origin file or folder
const target = params[1];  //destination folder

// Reporting
const printReport = (results) => {
   const name =      chalk.gray('img-src-placeholder');
   const source =    chalk.blue.bold(results.source);
   const target =    chalk.magenta(results.target);
   const arrow =     { big: chalk.gray.bold('➤➤➤'), little: chalk.gray.bold(' ⟹  ') };  //extra space for alignment
   const infoColor = results.count ? chalk.white : chalk.red.bold;
   const info =      infoColor(`(files: ${results.count}, ${results.duration}ms)`);
   const logFile =   (file) => log(name, chalk.white(file.origin), arrow.little, chalk.green(file.dest));
   log(name, source, arrow.big, target, info);
   if (!flagOn.summary)
      results.files.forEach(logFile);
   };

// Transform Files
const error =
   invalidFlag ?       'Invalid flag: ' + invalidFlag :
   !source ?           'Missing source folder.' :
   !target ?           'Missing target folder.' :
   params.length > 2 ? 'Extraneous parameter: ' + params[2] :
   null;
if (error)
   throw Error('[img-src-placeholder] ' + error);
const sourceFile =   path.join(flagMap.cd ?? '', source);
const isFile =       fs.existsSync(sourceFile) && fs.statSync(sourceFile).isFile();
const sourceFolder = isFile ? path.dirname(source) : source;
const options = {
   cd:         flagMap.cd ?? null,
   extensions: flagMap.ext?.split(',') ?? [],
   filename:   isFile ? path.basename(source) : null,
   };
const results = imgSrcPlaceholder.transform(sourceFolder, target, options);
if (!flagOn.quiet)
   printReport(results);
