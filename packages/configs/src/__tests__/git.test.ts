import {Manifest, composeManifest, generateContent} from '@rcgen/core';
import {git, gitIgnore, gitIgnoreFile} from '..';

describe('git', () => {
  it('adds a ".gitignore" file to the manifest', () => {
    const manifest = composeManifest(git())({});

    expect(manifest).toEqual({files: [gitIgnoreFile]});
    expect(manifest.files![0]).toBe(gitIgnoreFile);
  });
});

describe('gitIgnore', () => {
  it('adds a patcher to the manifest', () => {
    expect(composeManifest(gitIgnore())({})).toEqual({
      patchers: [expect.any(Function)]
    });
  });
});

describe('gitIgnoreFile', () => {
  let manifest: Manifest;

  function generateGitIgnoreFileContent(): string[] {
    return generateContent('/path/to/m', gitIgnoreFile.filename, () => ({
      default: manifest
    })) as any; // tslint:disable-line: no-any
  }

  it('generates empty content', () => {
    manifest = composeManifest(git(), gitIgnore())({});

    expect(generateGitIgnoreFileContent()).toEqual([]);
  });

  it('generates non-empty content', () => {
    const filetype = {contentSchema: {}, serializer: jest.fn()};

    manifest = composeManifest(
      git(),
      gitIgnore({
        additionalFilenames: ['b', 'b/c', 'c'],
        includedFilenamePatterns: ['*'],
        excludedFilenamePatterns: ['b']
      })
    )({
      files: [
        {filename: 'a', filetype, initialContent: {}},
        {filename: 'a/b', filetype, initialContent: {}}
      ]
    });

    expect(generateGitIgnoreFileContent()).toEqual(['a', 'c']);
  });
});
