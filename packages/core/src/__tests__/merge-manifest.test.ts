import {TestEnv} from './test-env';

import {mergeManifest} from '..';

describe('mergeManifest', () => {
  it('merges the manifest', () => {
    expect(mergeManifest({})()).toEqual({});
    expect(mergeManifest({})({})).toEqual({});

    const {file: fileA} = new TestEnv('a');
    const patcherA = jest.fn();

    expect(
      mergeManifest({
        files: [fileA],
        patchers: [patcherA],
        includedFilenamePatterns: ['a'],
        excludedFilenamePatterns: ['a']
      })()
    ).toEqual({
      files: [fileA],
      patchers: [patcherA],
      includedFilenamePatterns: ['a'],
      excludedFilenamePatterns: ['a']
    });

    expect(
      mergeManifest({
        files: [fileA],
        patchers: [patcherA],
        includedFilenamePatterns: ['a'],
        excludedFilenamePatterns: ['a']
      })({})
    ).toEqual({
      files: [fileA],
      patchers: [patcherA],
      includedFilenamePatterns: ['a'],
      excludedFilenamePatterns: ['a']
    });

    expect(
      mergeManifest({})({
        files: [fileA],
        patchers: [patcherA],
        includedFilenamePatterns: ['a'],
        excludedFilenamePatterns: ['a']
      })
    ).toEqual({
      files: [fileA],
      patchers: [patcherA],
      includedFilenamePatterns: ['a'],
      excludedFilenamePatterns: ['a']
    });

    const fileB = {...fileA, filename: 'b'};
    const patcherB = jest.fn();

    expect(
      mergeManifest({
        files: [fileB],
        patchers: [patcherB],
        includedFilenamePatterns: ['b'],
        excludedFilenamePatterns: ['b']
      })({
        files: [fileA],
        patchers: [patcherA],
        includedFilenamePatterns: ['a'],
        excludedFilenamePatterns: ['a']
      })
    ).toEqual({
      files: [fileA, fileB],
      patchers: [patcherA, patcherB],
      includedFilenamePatterns: ['a', 'b'],
      excludedFilenamePatterns: ['a', 'b']
    });
  });
});
