import {validate} from '@rcgen/core';
import {createJsonFiletype} from '..';

describe('createJsonFiletype', () => {
  const absoluteManifestFilename = '/path/to/m';
  const filename = 'a';

  describe('#contentSchema', () => {
    it('matches an object', () => {
      const {contentSchema} = createJsonFiletype();

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
      const {contentSchema} = createJsonFiletype({
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
    it('stringifies the given content to JSON', () => {
      const {serializer} = createJsonFiletype();

      expect(
        serializer({
          absoluteManifestFilename,
          filename,
          generatedContent: {foo: 'bar'}
        })
      ).toEqual(Buffer.from('{\n  "foo": "bar"\n}\n'));
    });
  });

  describe('#deserializer', () => {
    it('parses the given content as JSON', () => {
      const {deserializer} = createJsonFiletype();

      expect(
        deserializer!({
          absoluteManifestFilename,
          filename,
          readContentData: Buffer.from('{\n  "foo": "bar"\n}\n')
        })
      ).toEqual({
        foo: 'bar'
      });
    });
  });
});