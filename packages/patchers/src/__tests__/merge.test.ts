import {PatcherArgs} from '@rcgen/core';
import {merge} from '..';
import {createPatcherArgs} from './create-patcher-args';

describe('merge', () => {
  const oldContent = {foo: {bar: ['baz']}};
  const newContent = {foo: {bar: ['qux']}};
  const mergedContent = {foo: {bar: ['baz', 'qux']}};

  let patcher: jest.Mock;
  let patcherArgs: PatcherArgs<object>;
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

        it('returns merged content', () => {
          expect(merge(filename, patcher)(patcherArgs)).toEqual(mergedContent);

          expect(patcher.mock.calls).toEqual([[patcherArgs]]);
        });
      });

      describe('without new content', () => {
        beforeEach(() => {
          patcher = jest.fn(() => undefined);
        });

        it('returns old content', () => {
          expect(merge(filename, patcher)(patcherArgs)).toEqual(oldContent);

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
          expect(merge(filename, patcher)(patcherArgs)).toEqual(newContent);

          expect(patcher.mock.calls).toEqual([[patcherArgs]]);
        });
      });

      describe('without new content', () => {
        beforeEach(() => {
          patcher = jest.fn(() => undefined);
        });

        it('returns no content', () => {
          expect(merge(filename, patcher)(patcherArgs)).toBeUndefined();

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
        expect(merge(filename, patcher)(patcherArgs)).toEqual(oldContent);

        expect(patcher.mock.calls).toEqual([]);
      });
    });

    describe('without old content', () => {
      beforeEach(() => {
        patcherArgs = createPatcherArgs('a');
      });

      it('returns no content', () => {
        expect(merge(filename, patcher)(patcherArgs)).toBeUndefined();

        expect(patcher.mock.calls).toEqual([]);
      });
    });
  });
});
