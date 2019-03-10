import {TestEnv} from './test-env';

import {enhanceManifest} from '..';

describe('enhanceManifest', () => {
  it('enhances the specified manifest', () => {
    expect(enhanceManifest()({})).toEqual({});
    expect(enhanceManifest({})({})).toEqual({});

    const {file: fileA} = new TestEnv('a');
    const patcherA = jest.fn();

    expect(
      enhanceManifest({
        files: [fileA],
        patchers: [patcherA],
        includedFilenames: ['a'],
        excludedFilenames: ['a']
      })({})
    ).toEqual({
      files: [fileA],
      patchers: [patcherA],
      includedFilenames: ['a'],
      excludedFilenames: ['a']
    });

    expect(
      enhanceManifest({})({
        files: [fileA],
        patchers: [patcherA],
        includedFilenames: ['a'],
        excludedFilenames: ['a']
      })
    ).toEqual({
      files: [fileA],
      patchers: [patcherA],
      includedFilenames: ['a'],
      excludedFilenames: ['a']
    });

    const fileB = {...fileA, filename: 'b'};
    const patcherB = jest.fn();

    expect(
      enhanceManifest({
        files: [fileB],
        patchers: [patcherB],
        includedFilenames: ['b'],
        excludedFilenames: ['b']
      })({
        files: [fileA],
        patchers: [patcherA],
        includedFilenames: ['a'],
        excludedFilenames: ['a']
      })
    ).toEqual({
      files: [fileA, fileB],
      patchers: [patcherA, patcherB],
      includedFilenames: ['a', 'b'],
      excludedFilenames: ['a', 'b']
    });
  });
});
