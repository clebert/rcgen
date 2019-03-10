import {TestEnv} from './test-env';

import {enhanceManifest} from '..';

describe('enhanceManifest', () => {
  it('enhances the specified manifest', () => {
    expect(enhanceManifest({})({})).toEqual({});

    const {file} = new TestEnv();
    const patcher = jest.fn();

    expect(
      enhanceManifest({
        files: [file],
        patchers: [patcher],
        includedFilenames: ['a'],
        excludedFilenames: ['a']
      })({})
    ).toEqual({
      files: [file],
      patchers: [patcher],
      includedFilenames: ['a'],
      excludedFilenames: ['a']
    });

    expect(
      enhanceManifest({})({
        files: [file],
        patchers: [patcher],
        includedFilenames: ['a'],
        excludedFilenames: ['a']
      })
    ).toEqual({
      files: [file],
      patchers: [patcher],
      includedFilenames: ['a'],
      excludedFilenames: ['a']
    });

    const fileA = file;
    const fileB = {...file, filename: 'b'};

    const patcherA = patcher;
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
