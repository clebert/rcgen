import {PatcherArgs} from '@rcgen/core';
import {replace} from '..';
import {createPatcherArgs} from './create-patcher-args';

describe('replace', () => {
  const oldContent = 'foo';
  const newContent = ''; // The new content is intentionally falsy!

  let patcher: jest.Mock;
  let patcherArgs: PatcherArgs<string>;
  let filename: string;

  describe('with matching filename', () => {
    beforeEach(() => {
      filename = 'a';
    });

    describe('with old content', () => {
      beforeEach(() => {
        patcherArgs = createPatcherArgs('a', oldContent);
      });

      describe('with new content', () => {
        beforeEach(() => {
          patcher = jest.fn(() => newContent);
        });

        it('returns new content', () => {
          expect(replace(filename, patcher)(patcherArgs)).toEqual(newContent);

          expect(patcher.mock.calls).toEqual([[patcherArgs]]);
        });
      });

      describe('without new content', () => {
        beforeEach(() => {
          patcher = jest.fn(() => undefined);
        });

        it('returns old content', () => {
          expect(replace(filename, patcher)(patcherArgs)).toEqual(oldContent);

          expect(patcher.mock.calls).toEqual([[patcherArgs]]);
        });
      });
    });

    describe('without old content', () => {
      beforeEach(() => {
        patcherArgs = createPatcherArgs('a');
      });

      describe('with new content', () => {
        beforeEach(() => {
          patcher = jest.fn(() => newContent);
        });

        it('returns new content', () => {
          expect(replace(filename, patcher)(patcherArgs)).toEqual(newContent);

          expect(patcher.mock.calls).toEqual([[patcherArgs]]);
        });
      });

      describe('without new content', () => {
        beforeEach(() => {
          patcher = jest.fn(() => undefined);
        });

        it('returns no content', () => {
          expect(replace(filename, patcher)(patcherArgs)).toBeUndefined();

          expect(patcher.mock.calls).toEqual([[patcherArgs]]);
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
        patcherArgs = createPatcherArgs('a', oldContent);
      });

      it('returns old content', () => {
        expect(replace(filename, patcher)(patcherArgs)).toEqual(oldContent);

        expect(patcher.mock.calls).toEqual([]);
      });
    });

    describe('without old content', () => {
      beforeEach(() => {
        patcherArgs = createPatcherArgs('a');
      });

      it('returns no content', () => {
        expect(replace(filename, patcher)(patcherArgs)).toBeUndefined();

        expect(patcher.mock.calls).toEqual([]);
      });
    });
  });
});
