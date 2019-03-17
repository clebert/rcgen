import {validate} from '@rcgen/core';
import {createJsonFiletype} from '..';

describe('createJsonFiletype', () => {
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

    it('matches a custom type', () => {
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
    describe('without a custom content preprocessor', () => {
      it('creates a JSON string', () => {
        const {serializer} = createJsonFiletype();

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: {foo: 'bar'}
          })
        ).toEqual(Buffer.from('{\n  "foo": "bar"\n}\n'));
      });
    });

    describe('with a custom content preprocessor', () => {
      it('creates a JSON string after preprocessing the content', () => {
        const mockContentPreprocessor = jest.fn(() => ({baz: 'qux'} as object));

        const {serializer} = createJsonFiletype({
          contentPreprocessor: mockContentPreprocessor
        });

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: {foo: 'bar'}
          })
        ).toEqual(Buffer.from('{\n  "baz": "qux"\n}\n'));

        expect(mockContentPreprocessor.mock.calls).toEqual([[{foo: 'bar'}]]);
      });
    });
  });

  describe('#deserializer', () => {
    it('parses a JSON string', () => {
      const mockContentPreprocessor = jest.fn();

      const {deserializer} = createJsonFiletype({
        contentPreprocessor: mockContentPreprocessor
      });

      expect(
        deserializer!({
          absoluteManifestFilename: '/path/to/m',
          filename: 'a',
          contentData: Buffer.from('{\n  "foo": "bar"\n}\n')
        })
      ).toEqual({foo: 'bar'});

      expect(mockContentPreprocessor.mock.calls).toEqual([]);
    });
  });
});
