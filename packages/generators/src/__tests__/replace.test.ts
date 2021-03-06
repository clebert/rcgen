import {GeneratorArgs} from '@rcgen/core';
import {replace} from '..';
import {createGeneratorArgs} from './create-generator-args';

describe('replace', () => {
  const oldContent = 'foo';
  const newContent = ''; // The new content is intentionally falsy!

  let generator: jest.Mock;
  let generatorArgs: GeneratorArgs<string>;
  let filename: string;

  describe('with matching filename', () => {
    beforeEach(() => {
      filename = 'a';
    });

    describe('with old content', () => {
      beforeEach(() => {
        generatorArgs = createGeneratorArgs('a', oldContent);
      });

      describe('with new content', () => {
        beforeEach(() => {
          generator = jest.fn(() => newContent);
        });

        it('returns new content', () => {
          expect(replace(filename, generator)(generatorArgs)).toEqual(
            newContent
          );

          expect(generator.mock.calls).toEqual([[generatorArgs]]);
        });
      });

      describe('without new content', () => {
        beforeEach(() => {
          generator = jest.fn(() => undefined);
        });

        it('returns old content', () => {
          expect(replace(filename, generator)(generatorArgs)).toEqual(
            oldContent
          );

          expect(generator.mock.calls).toEqual([[generatorArgs]]);
        });
      });
    });

    describe('without old content', () => {
      beforeEach(() => {
        generatorArgs = createGeneratorArgs('a');
      });

      describe('with new content', () => {
        beforeEach(() => {
          generator = jest.fn(() => newContent);
        });

        it('returns new content', () => {
          expect(replace(filename, generator)(generatorArgs)).toEqual(
            newContent
          );

          expect(generator.mock.calls).toEqual([[generatorArgs]]);
        });
      });

      describe('without new content', () => {
        beforeEach(() => {
          generator = jest.fn(() => undefined);
        });

        it('returns no content', () => {
          expect(replace(filename, generator)(generatorArgs)).toBeUndefined();

          expect(generator.mock.calls).toEqual([[generatorArgs]]);
        });
      });
    });
  });

  describe('without matching filename', () => {
    beforeEach(() => {
      filename = 'b';
    });

    describe('with old content', () => {
      beforeEach(() => {
        generatorArgs = createGeneratorArgs('a', oldContent);
      });

      it('returns old content', () => {
        expect(replace(filename, generator)(generatorArgs)).toEqual(oldContent);

        expect(generator.mock.calls).toEqual([]);
      });
    });

    describe('without old content', () => {
      beforeEach(() => {
        generatorArgs = createGeneratorArgs('a');
      });

      it('returns no content', () => {
        expect(replace(filename, generator)(generatorArgs)).toBeUndefined();

        expect(generator.mock.calls).toEqual([]);
      });
    });
  });
});
