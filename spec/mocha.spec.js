// img-src-placeholder
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from 'cli-argv-util';
import assert from 'assert';
import fs     from 'fs';

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

   it('has functions named transform() and reporter()', () => {
      const module = imgSrcPlaceholder;
      const actual = Object.keys(module).sort().map(key => [key, typeof module[key]]);
      const expected = [
         ['htmlExts',  'object'],
         ['reporter',  'function'],
         ['transform', 'function'],
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Calling imgSrcPlaceholder.transform()', () => {

   it('creates the correct text files in the target folder', () => {
      const options = { cd: 'spec/fixtures' };
      imgSrcPlaceholder.transform('source', 'target/cd', options);
      const actual = cliArgvUtil.readFolder('spec/fixtures/target/cd');
      const expected = [
         'mock1.html',
         'subfolder',
         'subfolder/mock2.html',
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
   const run = (posix) => cliArgvUtil.run(pkg, posix);

   it('creates the expected file with the correct <img> placeholder', () => {
      run('img-src-placeholder spec/fixtures/source/subfolder spec/fixtures/target/cli');
      const html = fs.readFileSync('spec/fixtures/target/cli/mock2.html', 'utf-8');
      const imgTag = /<img [^>]*>/gm;
      const actual =   { tag: html.match(imgTag)[0] };
      const expected = { tag: '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg==" alt=placeholder>' };
      assertDeepStrictEqual(actual, expected);
      });

   });
