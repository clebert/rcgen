import {TestEnv} from './test-env';

import {enhanceManifest} from '..';

describe('enhanceManifest', () => {
  it('enhances the manifest', () => {
    expect(enhanceManifest({})({})).toEqual({});

    const {file: fileA} = new TestEnv('a');
    const patcherA = jest.fn();

    expect(
      enhanceManifest({
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
      enhanceManifest({})({
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
      enhanceManifest({
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
