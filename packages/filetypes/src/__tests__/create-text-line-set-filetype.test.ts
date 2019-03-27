import {validate} from '@rcgen/core';
import {TextLineSet, createTextLineSetFiletype} from '..';

describe('createTextLineSetFiletype', () => {
  describe('#contentSchema', () => {
    it('matches a string array', () => {
      const {contentSchema} = createTextLineSetFiletype();

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
    it('creates a text with a final newline', () => {
      const {serializer} = createTextLineSetFiletype();

      expect(
        serializer({
          absoluteManifestFilename: '/path/to/m',
          filename: 'a',
          content: new TextLineSet().addTextLine('a').addTextLine('b')
        })
      ).toEqual(Buffer.from('a\nb\n'));
    });

    it('creates a text without a final newline', () => {
      const {serializer} = createTextLineSetFiletype();

      expect(
        serializer({
          absoluteManifestFilename: '/path/to/m',
          filename: 'a',
          content: new TextLineSet()
        })
      ).toEqual(Buffer.from(''));
    });
  });

  describe('#deserializer', () => {
    it('parses a text', () => {
      const {deserializer} = createTextLineSetFiletype();

      expect(
        deserializer!({
          absoluteManifestFilename: '/path/to/m',
          filename: 'a',
          contentData: Buffer.from(' a \n\nb\r\nc')
        }).getTextLines()
      ).toEqual(['a', 'b', 'c']);
    });

    it('parses an empty text', () => {
      const {deserializer} = createTextLineSetFiletype();

      expect(
        deserializer!({
          absoluteManifestFilename: '/path/to/m',
          filename: 'a',
          contentData: Buffer.from('')
        }).getTextLines()
      ).toEqual([]);
    });
  });
});
