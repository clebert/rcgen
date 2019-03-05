import {addLines} from '..';

describe('addLines', () => {
  const absoluteManifestFilename = '/path/to/m';

  it('adds the specified lines to the generated content of the specified file', () => {
    const patcher = addLines('a', ['bar', 'baz']);

    expect(
      patcher({
        absoluteManifestFilename,
        filename: 'a',
        generatedContent: ['foo'],
        readContent: undefined
      })
    ).toEqual(['foo', 'bar', 'baz']);
  });

  it('does not add the specified lines to the generated content of an unspecified file', () => {
    const patcher = addLines('a', ['bar', 'baz']);

    expect(
      patcher({
        absoluteManifestFilename,
        filename: 'b',
        generatedContent: ['foo'],
        readContent: undefined
      })
    ).toEqual(['foo']);
  });
});
