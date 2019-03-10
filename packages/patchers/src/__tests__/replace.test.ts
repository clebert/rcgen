import {replace} from '..';

describe('replace', () => {
  const absoluteManifestFilename = '/path/to/m';

  it('replaces the generated content of the specified file with the specified value', () => {
    expect(
      replace('a', 'bar')({
        absoluteManifestFilename,
        filename: 'a',
        generatedContent: 'foo',
        readContent: undefined,
        otherFilenames: []
      })
    ).toEqual('bar');
  });

  it('does not replace the generated content of an unspecified file with the specified value', () => {
    expect(
      replace('a', 'bar')({
        absoluteManifestFilename,
        filename: 'b',
        generatedContent: 'foo',
        readContent: undefined,
        otherFilenames: []
      })
    ).toEqual('foo');
  });
});
