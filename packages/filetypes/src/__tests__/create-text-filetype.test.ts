import {validate} from '@rcgen/core';
import {createTextFiletype} from '..';

describe('createTextFiletype', () => {
  describe('#contentSchema', () => {
    it('matches a string array', () => {
      const {contentSchema} = createTextFiletype();

      const testCases = [
        {value: [], validationMessage: ''},
        {value: ['a'], validationMessage: ''},
        {value: {}, validationMessage: 'The value should be array.'},
        {value: [123], validationMessage: 'The value[0] should be string.'}
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
      it('creates a text', () => {
        const {serializer} = createTextFiletype();

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: ['3', '1', '2']
          })
        ).toEqual(Buffer.from('3\n1\n2'));
      });

      it('creates an empty text', () => {
        const {serializer} = createTextFiletype();

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: []
          })
        ).toEqual(Buffer.from(''));

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: ['']
          })
        ).toEqual(Buffer.from(''));
      });
    });

    describe('with a custom content preprocessor', () => {
      it('creates a text after preprocessing the content', () => {
        const {serializer} = createTextFiletype({
          contentPreprocessor: content => content.sort()
        });

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: ['3', '1', '2']
          })
        ).toEqual(Buffer.from('1\n2\n3'));
      });
    });
  });

  describe('#deserializer', () => {
    it('parses a text', () => {
      const {deserializer} = createTextFiletype();

      expect(
        deserializer!({
          absoluteManifestFilename: '/path/to/m',
          filename: 'a',
          contentData: Buffer.from('3\n1\n2')
        })
      ).toEqual(['3', '1', '2']);
    });

    it('parses an empty text', () => {
      const {deserializer} = createTextFiletype();

      expect(
        deserializer!({
          absoluteManifestFilename: '/path/to/m',
          filename: 'a',
          contentData: Buffer.from('')
        })
      ).toEqual(['']);
    });
  });
});
