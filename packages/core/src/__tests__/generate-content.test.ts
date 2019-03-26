import {filetype, mockNodeRequire} from './test-env';

import {generateContent} from '..';

describe('generateContent', () => {
  const absoluteManifestFilename = '/path/to/m';

  it('generates the content of the file', () => {
    const file = {filename: 'a', filetype};
    const manifest = {files: [file], patchers: [() => 'foo']};

    mockNodeRequire.mockReturnValue({default: manifest});

    expect(
      generateContent(absoluteManifestFilename, 'a', mockNodeRequire)
    ).toEqual('foo');
  });

  it('throws if none of the patchers matches the file', () => {
    const file = {filename: 'a', filetype};
    const manifest = {files: [file], patchers: [() => undefined]};

    mockNodeRequire.mockReturnValue({default: manifest});

    expect(() =>
      generateContent(absoluteManifestFilename, 'a', mockNodeRequire)
    ).toThrowError(
      new Error(
        "The content of file 'a' cannot be generated because none of the patchers matches the file."
      )
    );
  });
});
