import {validate} from '@rcgen/core';
import {createNodeModuleFiletype} from '..';

describe('createNodeModuleFiletype', () => {
  describe('#contentSchema', () => {
    it('matches an object', () => {
      const {contentSchema} = createNodeModuleFiletype();

      const testCases = [
        {value: {}, validationMessage: ''},
        {value: {foo: 'bar'}, validationMessage: ''},
        {value: [], validationMessage: 'The value should be object.'}
      ];

      for (const {value, validationMessage} of testCases) {
        const validationResult = validate(value, 'value', contentSchema);

        expect(validationResult.validationMessage).toBe(validationMessage);
        expect(validationResult.isValid(value)).toBe(!validationMessage);
      }
    });

    it('can be customized', () => {
      const {contentSchema} = createNodeModuleFiletype({
        contentSchema: {type: 'array'}
      });

      const testCases = [
        {value: {}, validationMessage: 'The value should be array.'},
        {value: {foo: 'bar'}, validationMessage: 'The value should be array.'},
        {value: [], validationMessage: ''}
      ];

      for (const {value, validationMessage} of testCases) {
        const validationResult = validate(value, 'value', contentSchema);

        expect(validationResult.validationMessage).toBe(validationMessage);
        expect(validationResult.isValid(value)).toBe(!validationMessage);
      }
    });
  });

  describe('#serializer', () => {
    it('generates a Node.js module', () => {
      const {serializer} = createNodeModuleFiletype();

      expect(
        serializer({
          absoluteManifestFilename: '/path/to/m',
          filename: 'a',
          generatedContent: {foo: 'bar'}
        })
      ).toEqual(
        Buffer.from(
          "// prettier-ignore\nmodule.exports = require('@rcgen/core').generateContent('/path/to/m', 'a');\n"
        )
      );
    });
  });
});
