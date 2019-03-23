import {filetype} from './test-env';

import {mergeManifest} from '..';

describe('mergeManifest', () => {
  it('merges the manifest', () => {
    expect(mergeManifest({})()).toEqual({});
    expect(mergeManifest({})({})).toEqual({});

    const fileA = {filename: 'a', filetype};
    const patcherA = jest.fn();

    expect(
      mergeManifest({
        files: [fileA],
        patchers: [patcherA],
        include: ['a'],
        exclude: ['a']
      })()
    ).toEqual({
      files: [fileA],
      patchers: [patcherA],
      include: ['a'],
      exclude: ['a']
    });

    expect(
      mergeManifest({
        files: [fileA],
        patchers: [patcherA],
        include: ['a'],
        exclude: ['a']
      })({})
    ).toEqual({
      files: [fileA],
      patchers: [patcherA],
      include: ['a'],
      exclude: ['a']
    });

    expect(
      mergeManifest({})({
        files: [fileA],
        patchers: [patcherA],
        include: ['a'],
        exclude: ['a']
      })
    ).toEqual({
      files: [fileA],
      patchers: [patcherA],
      include: ['a'],
      exclude: ['a']
    });

    const fileB = {filename: 'b', filetype};
    const patcherB = jest.fn();

    expect(
      mergeManifest({
        files: [fileB],
        patchers: [patcherB],
        include: ['b'],
        exclude: ['b']
      })({
        files: [fileA],
        patchers: [patcherA],
        include: ['a'],
        exclude: ['a']
      })
    ).toEqual({
      files: [fileA, fileB],
      patchers: [patcherA, patcherB],
      include: ['a', 'b'],
      exclude: ['a', 'b']
    });
  });
});
