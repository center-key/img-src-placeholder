// img-src-placeholder
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { execSync } from 'node:child_process';
import { revWebAssets } from 'rev-web-assets';
import assert from 'assert';
import fs from     'fs';

// Setup
import { imgSrcPlaceholder } from '../dist/img-src-placeholder.js';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = fs.readdirSync('dist').sort();
      const expected = [
         'img-src-placeholder.d.ts',
         'img-src-placeholder.js',
         'img-src-placeholder.umd.cjs',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   it('is an object', () => {
      const actual =   { constructor: imgSrcPlaceholder.constructor.name };
      const expected = { constructor: 'Object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has a transform() function', () => {
      const actual =   { validate: typeof imgSrcPlaceholder.transform };
      const expected = { validate: 'function' };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Calling imgSrcPlaceholder.transform()', () => {

   it('creates the correct text files in the target folder', () => {
      const options = { cd: 'spec/fixtures' };
      imgSrcPlaceholder.transform('source', 'target/cd', options);
      const actual = revWebAssets.readFolderRecursive('spec/fixtures/target/cd');
      const expected = [
         'spec/fixtures/target/cd/mock1.html',
         'spec/fixtures/target/cd/subfolder/mock2.html',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Correct error is thrown', () => {

   it('when the "source" folder is missing', () => {
      const makeBogusCall = () => imgSrcPlaceholder.transform();
      const exception =     { message: '[replacer-util] Must specify the source folder path.' };
      assert.throws(makeBogusCall, exception);
      });

   it('when the "target" folder is missing', () => {
      const makeBogusCall = () => imgSrcPlaceholder.transform('/source-folder');
      const exception =     { message: '[replacer-util] Must specify the target folder path.' };
      assert.throws(makeBogusCall, exception);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Executing the CLI', () => {
   const run = (posix) => {
      const name =    Object.keys(pkg.bin).sort()[0];
      const command = process.platform === 'win32' ? posix.replaceAll('\\ ', '" "') : posix;
      execSync(command.replace(name, 'node bin/cli.js'), { stdio: 'inherit' });
      };

   it('creates the expected file with the correct <img> placeholder', () => {
      run('img-src-placeholder spec/fixtures/source/subfolder spec/fixtures/target/cli');
      const html = fs.readFileSync('spec/fixtures/target/cli/mock2.html', 'utf-8');
      const imgTag = /<img [^>]*>/gm;
      const actual =   { tag: html.match(imgTag)[0] };
      const expected = { tag: '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg==" alt=placeholder>' };
      assertDeepStrictEqual(actual, expected);
      });

   });
