import {validate} from '@rcgen/core';
import {createTextLinesFiletype} from '..';

describe('createTextLinesFiletype', () => {
  describe('#contentSchema', () => {
    it('matches a string array', () => {
      const {contentSchema} = createTextLinesFiletype();

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
      it('creates a text after trimming all text lines', () => {
        const {serializer} = createTextLinesFiletype();

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: [' a ', '\nb\r', 'c']
          })
        ).toEqual(Buffer.from('a\nb\nc\n'));
      });

      it('creates a text after removing all blank text lines', () => {
        const {serializer} = createTextLinesFiletype();

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: ['\n', '', 'a', ' ', 'b', 'c']
          })
        ).toEqual(Buffer.from('a\nb\nc\n'));
      });

      it('creates a text after removing all duplicate text lines', () => {
        const {serializer} = createTextLinesFiletype();

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: ['a', 'b', ' a ', 'c']
          })
        ).toEqual(Buffer.from('a\nb\nc\n'));
      });

      it('creates a text after sorting all text lines alphabetically', () => {
        const {serializer} = createTextLinesFiletype();

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: ['c', ' a ', 'b']
          })
        ).toEqual(Buffer.from('a\nb\nc\n'));
      });

      it('creates a text without a final newline', () => {
        const {serializer} = createTextLinesFiletype();

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
            content: ['\n']
          })
        ).toEqual(Buffer.from(''));
      });
    });

    describe('with a custom content preprocessor', () => {
      it('creates a text after preprocessing all text lines', () => {
        const mockContentPreprocessor = jest.fn(() => [' a ', '', 'b\r', 'c']);

        const {serializer} = createTextLinesFiletype({
          contentPreprocessor: mockContentPreprocessor
        });

        expect(
          serializer({
            absoluteManifestFilename: '/path/to/m',
            filename: 'a',
            content: ['a', 'b', 'c']
          })
        ).toEqual(Buffer.from(' a \n\nb\r\nc'));

        expect(mockContentPreprocessor.mock.calls).toEqual([[['a', 'b', 'c']]]);
      });
    });
  });

  describe('#deserializer', () => {
    it('parses a text', () => {
      const mockContentPreprocessor = jest.fn();

      const {deserializer} = createTextLinesFiletype({
        contentPreprocessor: mockContentPreprocessor
      });

      expect(
        deserializer!({
          absoluteManifestFilename: '/path/to/m',
          filename: 'a',
          contentData: Buffer.from(' a \n\nb\r\nc')
        })
      ).toEqual([' a ', '', 'b\r', 'c']);

      expect(mockContentPreprocessor.mock.calls).toEqual([]);
    });
  });
});
