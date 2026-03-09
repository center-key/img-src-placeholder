// img-src-placeholder
// CLI Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from 'cli-argv-util';
import fs from 'fs';

// Setup and Utilities
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const run = (posix) => cliArgvUtil.run(pkg, posix);

////////////////////////////////////////////////////////////////////////////////
describe('Executing the CLI', () => {

   it('creates the expected file with the correct <img> placeholder', () => {
      run('img-src-placeholder spec/fixtures/subfolder spec/target/cli');
      const html =     fs.readFileSync('spec/target/cli/mock2.html', 'utf-8');
      const imgTag =   /<img [^>]*>/gm;
      const actual =   { tag: html.match(imgTag)[0] };
      const expected = { tag: '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg==" alt=placeholder>' };
      assertDeepStrictEqual(actual, expected);
      });

   });
