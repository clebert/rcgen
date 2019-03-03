import {validate} from '@rcgen/core';
import {TextFiletypeOptions, createTextFiletype} from '..';

describe('createTextFiletype', () => {
  let options: TextFiletypeOptions | undefined;

  beforeEach(() => {
    options = undefined;
  });

  it('defines a content schema that matches the content type', () => {
    const {contentSchema} = createTextFiletype(options);

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

  describe("with setting option 'newlineCharacter' to '\\r'", () => {
    beforeEach(() => {
      options = {newlineCharacter: '\r'};
    });

    it('deserializes a given content', () => {
      const {deserializer} = createTextFiletype(options);

      expect(deserializer!(Buffer.from('a\rb'))).toEqual(['a', 'b']);
      expect(deserializer!(Buffer.from('a\rb\r'))).toEqual(['a', 'b', '']);
      expect(deserializer!(Buffer.from('a\rb\n'))).toEqual(['a', 'b\n']);
    });

    describe("with setting option 'insertFinalNewline' to true", () => {
      beforeEach(() => {
        options = {...options, insertFinalNewline: true};
      });

      it('serializes a given content', () => {
        const {serializer} = createTextFiletype(options);

        expect(serializer(['a', 'b'])).toEqual(Buffer.from('a\rb\r'));
        expect(serializer(['a', 'b\r'])).toEqual(Buffer.from('a\rb\r'));
        expect(serializer(['a', 'b\n'])).toEqual(Buffer.from('a\rb\n\r'));
        expect(serializer(['a', 'b', ''])).toEqual(Buffer.from('a\rb\r'));
      });
    });

    describe("without setting option 'insertFinalNewline'", () => {
      it('serializes a given content', () => {
        const {serializer} = createTextFiletype(options);

        expect(serializer(['a', 'b'])).toEqual(Buffer.from('a\rb'));
        expect(serializer(['a', 'b\r'])).toEqual(Buffer.from('a\rb\r'));
        expect(serializer(['a', 'b\n'])).toEqual(Buffer.from('a\rb\n'));
        expect(serializer(['a', 'b', ''])).toEqual(Buffer.from('a\rb\r'));
      });
    });
  });

  describe("without setting option 'newlineCharacter'", () => {
    it('deserializes a given content', () => {
      const {deserializer} = createTextFiletype(options);

      expect(deserializer!(Buffer.from('a\nb'))).toEqual(['a', 'b']);
      expect(deserializer!(Buffer.from('a\nb\n'))).toEqual(['a', 'b', '']);
      expect(deserializer!(Buffer.from('a\nb\r'))).toEqual(['a', 'b\r']);
    });

    describe("with setting option 'insertFinalNewline' to true", () => {
      beforeEach(() => {
        options = {...options, insertFinalNewline: true};
      });

      it('serializes a given content', () => {
        const {serializer} = createTextFiletype(options);

        expect(serializer(['a', 'b'])).toEqual(Buffer.from('a\nb\n'));
        expect(serializer(['a', 'b\n'])).toEqual(Buffer.from('a\nb\n'));
        expect(serializer(['a', 'b\r'])).toEqual(Buffer.from('a\nb\r\n'));
        expect(serializer(['a', 'b', ''])).toEqual(Buffer.from('a\nb\n'));
      });
    });

    describe("without setting option 'insertFinalNewline'", () => {
      it('serializes a given content', () => {
        const {serializer} = createTextFiletype(options);

        expect(serializer(['a', 'b'])).toEqual(Buffer.from('a\nb'));
        expect(serializer(['a', 'b\n'])).toEqual(Buffer.from('a\nb\n'));
        expect(serializer(['a', 'b\r'])).toEqual(Buffer.from('a\nb\r'));
        expect(serializer(['a', 'b', ''])).toEqual(Buffer.from('a\nb\n'));
      });
    });
  });
});
