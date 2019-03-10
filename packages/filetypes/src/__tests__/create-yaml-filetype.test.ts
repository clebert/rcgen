import {validate} from '@rcgen/core';
import {createYamlFiletype} from '..';

describe('createYamlFiletype', () => {
  const absoluteManifestFilename = '/path/to/m';
  const filename = 'a';

  describe('#contentSchema', () => {
    it('matches an object', () => {
      const {contentSchema} = createYamlFiletype();

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
      const {contentSchema} = createYamlFiletype({
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
    it('stringifies the specified content to YAML', () => {
      const {serializer} = createYamlFiletype();

      expect(
        serializer({
          absoluteManifestFilename,
          filename,
          generatedContent: {foo: 'bar', baz: [123, 456]}
        })
      ).toEqual(Buffer.from('foo: bar\nbaz:\n  - 123\n  - 456\n'));
    });
  });

  describe('#deserializer', () => {
    it('parses the specified content as YAML', () => {
      const {deserializer} = createYamlFiletype();

      expect(
        deserializer!({
          absoluteManifestFilename,
          filename,
          readContentData: Buffer.from('foo: bar\nbaz:\n  - 123\n  - 456\n')
        })
      ).toEqual({foo: 'bar', baz: [123, 456]});
    });
  });
});
