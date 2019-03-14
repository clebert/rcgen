import {validate} from '@rcgen/core';
import {createLinesFiletype} from '..';

describe('createLinesFiletype', () => {
  const absoluteManifestFilename = '/path/to/m';
  const filename = 'a';

  describe('#contentSchema', () => {
    it('matches a string array', () => {
      const {contentSchema} = createLinesFiletype();

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
    it('uses LF as newline', () => {
      const {serializer} = createLinesFiletype();

      expect(
        serializer({absoluteManifestFilename, filename, content: []})
      ).toEqual(Buffer.from(''));

      expect(
        serializer({
          absoluteManifestFilename,
          filename,
          content: ['', 'b', '', 'c', ' a ', '\nb\r', 'a', '']
        })
      ).toEqual(Buffer.from('a\nb\nc\n'));
    });

    it('uses CR as newline', () => {
      const {serializer} = createLinesFiletype({newline: '\r'});

      expect(
        serializer({absoluteManifestFilename, filename, content: []})
      ).toEqual(Buffer.from(''));

      expect(
        serializer({
          absoluteManifestFilename,
          filename,
          content: ['', 'b', '', 'c', ' a ', '\nb\r', 'a', '']
        })
      ).toEqual(Buffer.from('a\rb\rc\r'));
    });
  });

  describe('#deserializer', () => {
    it('uses LF as newline', () => {
      const {deserializer} = createLinesFiletype();

      expect(
        deserializer!({
          absoluteManifestFilename,
          filename,
          contentData: Buffer.from('')
        })
      ).toEqual([]);

      expect(
        deserializer!({
          absoluteManifestFilename,
          filename,
          contentData: Buffer.from('\n')
        })
      ).toEqual([]);

      expect(
        deserializer!({
          absoluteManifestFilename,
          filename,
          contentData: Buffer.from('\nb\nc\n a \n\nb\r\na\n')
        })
      ).toEqual(['a', 'b', 'c']);
    });

    it('uses CR as newline', () => {
      const {deserializer} = createLinesFiletype({newline: '\r'});

      expect(
        deserializer!({
          absoluteManifestFilename,
          filename,
          contentData: Buffer.from('\r')
        })
      ).toEqual([]);

      expect(
        deserializer!({
          absoluteManifestFilename,
          filename,
          contentData: Buffer.from('\rb\rc\r a \r\nb\r\ra\r')
        })
      ).toEqual(['a', 'b', 'c']);
    });
  });
});
