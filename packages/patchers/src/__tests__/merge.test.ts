import {merge} from '..';

describe('merge', () => {
  const absoluteManifestFilename = '/path/to/m';

  it('merges the specified object with the generated content of the specified file', () => {
    const patcher = merge<object>('a', {foo: {bar: [456]}, baz: 'qux'});

    expect(
      patcher({
        absoluteManifestFilename,
        filename: 'a',
        generatedContent: {foo: {bar: [123]}},
        readContent: undefined
      })
    ).toEqual({foo: {bar: [123, 456]}, baz: 'qux'});
  });

  it('does not merge the specified object with the generated content of an unspecified file', () => {
    const patcher = merge<object>('a', {foo: {bar: [456]}, baz: 'qux'});

    expect(
      patcher({
        absoluteManifestFilename,
        filename: 'b',
        generatedContent: {foo: {bar: [123]}},
        readContent: undefined
      })
    ).toEqual({foo: {bar: [123]}});
  });
});
