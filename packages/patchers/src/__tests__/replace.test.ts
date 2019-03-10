import {replace} from '..';

describe('replace', () => {
  const absoluteManifestFilename = '/path/to/m';

  it('replaces the generated content of the specified file with the result of the specified patcher', () => {
    const patcher = jest.fn(() => 'bar');

    const args = {
      absoluteManifestFilename,
      filename: 'a',
      generatedContent: 'foo',
      readContent: undefined,
      otherFilenames: []
    };

    expect(replace('a', patcher)(args)).toEqual('bar');

    expect(patcher.mock.calls).toEqual([[args]]);
  });

  it('does not replace the generated content of an unspecified file with the result of the specified patcher', () => {
    const args = {
      absoluteManifestFilename,
      filename: 'b',
      generatedContent: 'foo',
      readContent: undefined,
      otherFilenames: []
    };

    expect(replace('a', () => 'bar')(args)).toEqual('foo');
  });
});
