// img-src-placeholder
// Function transform() Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from 'cli-argv-util';

// Setup
import { imgSrcPlaceholder } from '../dist/img-src-placeholder.js';

////////////////////////////////////////////////////////////////////////////////
describe('Calling imgSrcPlaceholder.transform()', () => {

   it('creates the correct text files in the target folder', () => {
      const options = { cd: 'spec' };
      imgSrcPlaceholder.transform('fixtures', 'target/cd', options);
      const actual = cliArgvUtil.readFolder('spec/target/cd');
      const expected = [
         'mock1.html',
         'subfolder',
         'subfolder/mock2.html',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });
