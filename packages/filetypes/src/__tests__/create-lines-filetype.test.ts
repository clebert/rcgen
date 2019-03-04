import {validate} from '@rcgen/core';
import {createLinesFiletype} from '..';

describe('createLinesFiletype', () => {
  describe('#contentSchema', () => {
    it('matches the content type', () => {
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

      expect(serializer([])).toEqual(Buffer.from('\n'));

      expect(serializer(['', 'b', '', 'c', ' a ', '\nb\r', 'a', ''])).toEqual(
        Buffer.from('a\nb\nc\n')
      );
    });

    it('uses CR as newline', () => {
      const {serializer} = createLinesFiletype({newline: '\r'});

      expect(serializer([])).toEqual(Buffer.from('\r'));

      expect(serializer(['', 'b', '', 'c', ' a ', '\nb\r', 'a', ''])).toEqual(
        Buffer.from('a\rb\rc\r')
      );
    });
  });

  describe('#deserializer', () => {
    it('uses LF as newline', () => {
      const {deserializer} = createLinesFiletype();

      expect(deserializer!(Buffer.from('\n'))).toEqual([]);

      expect(deserializer!(Buffer.from('\nb\nc\n a \n\nb\r\na\n'))).toEqual([
        'a',
        'b',
        'c'
      ]);
    });

    it('uses CR as newline', () => {
      const {deserializer} = createLinesFiletype({newline: '\r'});

      expect(deserializer!(Buffer.from('\r'))).toEqual([]);

      expect(deserializer!(Buffer.from('\rb\rc\r a \r\nb\r\ra\r'))).toEqual([
        'a',
        'b',
        'c'
      ]);
    });
  });
});
