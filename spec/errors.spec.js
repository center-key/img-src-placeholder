// img-src-placeholder
// Error Handling Specification Suite

// Imports
import assert from 'node:assert';

// Setup
import { imgSrcPlaceholder } from '../dist/img-src-placeholder.js';

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
