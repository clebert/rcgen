import {filetype} from './test-env';

import {mergeManifest} from '..';

describe('mergeManifest', () => {
  it('merges the manifest', () => {
    expect(mergeManifest({})()).toEqual({});
    expect(mergeManifest({})({})).toEqual({});

    const fileA = {filename: 'a', filetype};
    const patcherA = jest.fn();

    expect(mergeManifest({files: [fileA], patchers: [patcherA]})()).toEqual({
      files: [fileA],
      patchers: [patcherA]
    });

    expect(mergeManifest({files: [fileA], patchers: [patcherA]})({})).toEqual({
      files: [fileA],
      patchers: [patcherA]
    });

    expect(mergeManifest({})({files: [fileA], patchers: [patcherA]})).toEqual({
      files: [fileA],
      patchers: [patcherA]
    });

    const fileB = {filename: 'b', filetype};
    const patcherB = jest.fn();

    expect(
      mergeManifest({files: [fileB], patchers: [patcherB]})({
        files: [fileA],
        patchers: [patcherA]
      })
    ).toEqual({files: [fileA, fileB], patchers: [patcherA, patcherB]});
  });
});
