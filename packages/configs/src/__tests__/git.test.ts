import {Manifest, composeEnhancers, generateContent} from '@rcgen/core';
import {git, gitIgnore, gitIgnoreFile} from '..';

describe('git', () => {
  it('adds a ".gitignore" file to the enhanced manifest', () => {
    const enhancedManifest = composeEnhancers([git()])({});

    expect(enhancedManifest).toEqual({files: [gitIgnoreFile]});
    expect(enhancedManifest.files![0]).toBe(gitIgnoreFile);
  });
});

describe('gitIgnore', () => {
  it('adds a patcher to the enhanced manifest', () => {
    expect(composeEnhancers([gitIgnore()])({})).toEqual({
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
    manifest = composeEnhancers([git(), gitIgnore()])({});

    expect(generateGitIgnoreFileContent()).toEqual([]);
  });

  it('generates non-empty content', () => {
    const filetype = {contentSchema: {}, serializer: jest.fn()};

    manifest = composeEnhancers([
      git(),
      gitIgnore({
        additionalFilenames: ['b', 'b/c', 'c'],
        includedFilenamePatterns: ['*'],
        excludedFilenamePatterns: ['b']
      })
    ])({
      files: [
        {filename: 'a', filetype, initialContent: {}},
        {filename: 'a/b', filetype, initialContent: {}}
      ]
    });

    expect(generateGitIgnoreFileContent()).toEqual(['a', 'c']);
  });
});
