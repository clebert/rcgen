import {TestEnv} from './test-env';

import {Manifest, generateContent} from '..';

describe('generateContent', () => {
  it('generates the content of the file', () => {
    const {
      mockNodeRequire,
      exisitingContent,
      exisitingContentData,
      absoluteManifestFilename,
      fileWithDeserializer
    } = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);
    TestEnv.mockReadFileSync.mockReturnValue(exisitingContentData);

    const manifest: Manifest = {
      files: [fileWithDeserializer],
      patchers: [args => [...args.generatedContent, ...args.exisitingContent]]
    };

    mockNodeRequire.mockReturnValue({default: manifest});

    const {initialContent} = fileWithDeserializer;

    expect(
      generateContent(absoluteManifestFilename, 'a', mockNodeRequire)
    ).toEqual([...initialContent, ...exisitingContent]);
  });

  it('throws if the file is not included', () => {
    const {mockNodeRequire, absoluteManifestFilename, file} = new TestEnv('a');
    const manifest: Manifest = {files: [file], includedFilenamePatterns: []};

    mockNodeRequire.mockReturnValue({default: manifest});

    expect(() =>
      generateContent(absoluteManifestFilename, 'a', mockNodeRequire)
    ).toThrowError(
      new Error(
        "The content of file 'a' cannot be generated because the file is not included."
      )
    );
  });
});
