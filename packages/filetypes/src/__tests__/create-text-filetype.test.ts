import {validate} from '@rcgen/core';
import {createTextFiletype} from '..';

describe('createTextFiletype', () => {
  describe('#contentSchema', () => {
    it('matches the content type', () => {
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
    it('serializes a given content using the default newline character', () => {
      const {serializer} = createTextFiletype();

      expect(serializer(['a', 'b'])).toEqual(Buffer.from('a\nb\n'));
      expect(serializer(['a', 'b\n'])).toEqual(Buffer.from('a\nb\n'));
      expect(serializer(['a', 'b\r'])).toEqual(Buffer.from('a\nb\r\n'));
      expect(serializer(['a', 'b', ''])).toEqual(Buffer.from('a\nb\n'));
    });

    it('serializes a given content using a custom newline character', () => {
      const {serializer} = createTextFiletype({newlineCharacter: '\r'});

      expect(serializer(['a', 'b'])).toEqual(Buffer.from('a\rb\r'));
      expect(serializer(['a', 'b\r'])).toEqual(Buffer.from('a\rb\r'));
      expect(serializer(['a', 'b\n'])).toEqual(Buffer.from('a\rb\n\r'));
      expect(serializer(['a', 'b', ''])).toEqual(Buffer.from('a\rb\r'));
    });
  });

  describe('#deserializer', () => {
    it('deserializes a given content using the default newline character', () => {
      const {deserializer} = createTextFiletype();

      expect(deserializer!(Buffer.from('a\nb'))).toEqual(['a', 'b']);
      expect(deserializer!(Buffer.from('a\nb\n'))).toEqual(['a', 'b', '']);
      expect(deserializer!(Buffer.from('a\nb\r'))).toEqual(['a', 'b\r']);
    });

    it('deserializes a given content using a custom newline character', () => {
      const {deserializer} = createTextFiletype({newlineCharacter: '\r'});

      expect(deserializer!(Buffer.from('a\rb'))).toEqual(['a', 'b']);
      expect(deserializer!(Buffer.from('a\rb\r'))).toEqual(['a', 'b', '']);
      expect(deserializer!(Buffer.from('a\rb\n'))).toEqual(['a', 'b\n']);
    });
  });
});
