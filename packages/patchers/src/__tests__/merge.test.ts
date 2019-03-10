import {merge} from '..';

describe('merge', () => {
  const absoluteManifestFilename = '/path/to/m';

  it('merges the result of the specified patcher with the generated content of the specified file', () => {
    const patcher = jest.fn(() => ({foo: {bar: [456]}, baz: 'qux'}));

    const args = {
      absoluteManifestFilename,
      filename: 'a',
      generatedContent: {foo: {bar: [123]}},
      readContent: undefined,
      otherFilenames: []
    };

    expect(merge<object>('a', patcher)(args)).toEqual({
      foo: {bar: [123, 456]},
      baz: 'qux'
    });

    expect(patcher.mock.calls).toEqual([[args]]);

    expect(
      merge<number[]>('a', () => [456])({...args, generatedContent: [123]})
    ).toEqual([123, 456]);
  });

  it('does not merge the result of the specified patcher with the generated content of an unspecified file', () => {
    const args = {
      absoluteManifestFilename,
      filename: 'b',
      generatedContent: {foo: {bar: [123]}},
      readContent: undefined,
      otherFilenames: []
    };

    expect(
      merge<object>('a', () => ({foo: {bar: [456]}, baz: 'qux'}))(args)
    ).toEqual({foo: {bar: [123]}});

    expect(
      merge<number[]>('a', () => [456])({...args, generatedContent: [123]})
    ).toEqual([123]);
  });
});
