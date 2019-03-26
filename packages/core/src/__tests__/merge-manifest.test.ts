import {filetype} from './test-env';

import {mergeManifest} from '..';

describe('mergeManifest', () => {
  it('merges the manifest', () => {
    expect(mergeManifest({})()).toEqual({});
    expect(mergeManifest({})({})).toEqual({});

    const fileA = {filename: 'a', filetype};
    const generatorA = jest.fn();

    expect(mergeManifest({files: [fileA], generators: [generatorA]})()).toEqual(
      {files: [fileA], generators: [generatorA]}
    );

    expect(
      mergeManifest({files: [fileA], generators: [generatorA]})({})
    ).toEqual({files: [fileA], generators: [generatorA]});

    expect(
      mergeManifest({})({files: [fileA], generators: [generatorA]})
    ).toEqual({files: [fileA], generators: [generatorA]});

    const fileB = {filename: 'b', filetype};
    const generatorB = jest.fn();

    expect(
      mergeManifest({files: [fileB], generators: [generatorB]})({
        files: [fileA],
        generators: [generatorA]
      })
    ).toEqual({files: [fileA, fileB], generators: [generatorA, generatorB]});
  });
});
