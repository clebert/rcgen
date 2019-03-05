import {merge} from '..';

describe('merge', () => {
  const absoluteManifestFilename = '/path/to/m';

  it('merges the specified object with the generated content of the specified file', () => {
    expect(
      merge<object>('a', {foo: {bar: [456]}, baz: 'qux'})({
        absoluteManifestFilename,
        filename: 'a',
        generatedContent: {foo: {bar: [123]}},
        readContent: undefined
      })
    ).toEqual({foo: {bar: [123, 456]}, baz: 'qux'});

    expect(
      merge<number[]>('a', [456])({
        absoluteManifestFilename,
        filename: 'a',
        generatedContent: [123],
        readContent: undefined
      })
    ).toEqual([123, 456]);
  });

  it('does not merge the specified object with the generated content of an unspecified file', () => {
    expect(
      merge<object>('a', {foo: {bar: [456]}, baz: 'qux'})({
        absoluteManifestFilename,
        filename: 'b',
        generatedContent: {foo: {bar: [123]}},
        readContent: undefined
      })
    ).toEqual({foo: {bar: [123]}});

    expect(
      merge<number[]>('a', [456])({
        absoluteManifestFilename,
        filename: 'b',
        generatedContent: [123],
        readContent: undefined
      })
    ).toEqual([123]);
  });
});
