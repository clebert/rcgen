import {TestEnv} from './test-env';

import {Manifest, generateContent} from '..';

describe('generateContent', () => {
  it('returns the generated content of the file', () => {
    const {
      mockNodeRequire,
      readContent,
      readContentData,
      absoluteManifestFilename,
      fileWithDeserializer
    } = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);
    TestEnv.mockReadFileSync.mockReturnValue(readContentData);

    const manifest: Manifest = {
      files: [fileWithDeserializer],
      patchers: [args => [...args.generatedContent, ...args.readContent]]
    };

    mockNodeRequire.mockReturnValue({default: manifest});

    const {initialContent} = fileWithDeserializer;

    expect(
      generateContent(absoluteManifestFilename, 'a', mockNodeRequire)
    ).toEqual([...initialContent, ...readContent]);
  });

  it('throws if the file is not included', () => {
    const {mockNodeRequire, absoluteManifestFilename, file} = new TestEnv('a');
    const manifest: Manifest = {files: [file], includedFilenames: []};

    mockNodeRequire.mockReturnValue({default: manifest});

    expect(() =>
      generateContent(absoluteManifestFilename, file.filename, mockNodeRequire)
    ).toThrowError(
      new Error(
        "The content of file 'a' cannot be generated because the file is not included."
      )
    );
  });
});
