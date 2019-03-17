import {validate} from '@rcgen/core';
import {createYamlFiletype} from '..';

describe('createYamlFiletype', () => {
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

    it('matches a custom type', () => {
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
    describe('without a custom content preprocessor', () => {
      it('creates a YAML string', () => {
        const {serializer} = createYamlFiletype();

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: {foo: 'bar'}
          })
        ).toEqual(Buffer.from('foo: bar\n'));
      });
    });

    describe('with a custom content preprocessor', () => {
      it('creates a YAML string after preprocessing the content', () => {
        const mockContentPreprocessor = jest.fn(() => ({baz: 'qux'} as object));

        const {serializer} = createYamlFiletype({
          contentPreprocessor: mockContentPreprocessor
        });

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: {foo: 'bar'}
          })
        ).toEqual(Buffer.from('baz: qux\n'));

        expect(mockContentPreprocessor.mock.calls).toEqual([[{foo: 'bar'}]]);
      });
    });
  });

  describe('#deserializer', () => {
    it('parses a YAML string', () => {
      const {deserializer} = createYamlFiletype();

      expect(
        deserializer!({
          absoluteManifestFilename: '/path/to/m',
          filename: 'a',
          contentData: Buffer.from('foo: bar\n')
        })
      ).toEqual({foo: 'bar'});
    });
  });
});
