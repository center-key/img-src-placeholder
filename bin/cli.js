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
//    $ node bin/cli.js --cd=spec fixtures target/cd --summary

import { imgSrcPlaceholder } from '../dist/img-src-placeholder.js';

imgSrcPlaceholder.cli();
