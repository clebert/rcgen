import {filetype} from './test-env';

import {generateFile} from '..';

describe('generateFile', () => {
  const absoluteManifestFilename = '/path/to/m';

  it('generates the file by calling multiple generators one after the other', () => {
    const mockGenerator1 = jest.fn(() => 'bar');
    const mockGenerator2 = jest.fn(() => undefined);
    const mockGenerator3 = jest.fn(() => 'baz');

    const generators = [mockGenerator1, mockGenerator2, mockGenerator3];
    const loadedFile = {filename: 'a', filetype, existingContent: 'foo'};

    expect(
      generateFile({absoluteManifestFilename, generators}, loadedFile)
    ).toEqual({...loadedFile, generatedContent: 'baz'});

    const generatorArgs = {
      absoluteManifestFilename,
      filename: 'a',
      previouslyGeneratedContent: undefined,
      existingContent: 'foo'
    };

    expect(mockGenerator1.mock.calls).toEqual([[generatorArgs]]);

    expect(mockGenerator2.mock.calls).toEqual([
      [{...generatorArgs, previouslyGeneratedContent: 'bar'}]
    ]);

    expect(mockGenerator3.mock.calls).toEqual([
      [{...generatorArgs, previouslyGeneratedContent: 'bar'}]
    ]);
  });

  it('generates the file if the only generator generates falsy content', () => {
    const generators = [() => ''];
    const loadedFile = {filename: 'a', filetype};

    expect(
      generateFile({absoluteManifestFilename, generators}, loadedFile)
    ).toEqual({...loadedFile, generatedContent: ''});
  });

  it('does not generate the file if the only generator generates no content', () => {
    const generators = [() => undefined];
    const loadedFile = {filename: 'a', filetype};

    expect(
      generateFile({absoluteManifestFilename, generators}, loadedFile)
    ).toBe(null);
  });

  it('does not generate the file if no generators exist', () => {
    const loadedFile = {filename: 'a', filetype};

    expect(generateFile({absoluteManifestFilename}, loadedFile)).toBe(null);
  });

  it('passes other filenames to a generator if other files exist', () => {
    const files = [
      {filename: 'a', filetype},
      {filename: 'b', filetype},
      {filename: 'c', filetype}
    ];

    const mockGenerator = jest.fn();
    const generators = [mockGenerator];
    const loadedFile = {filename: 'a', filetype};

    generateFile({absoluteManifestFilename, files, generators}, loadedFile);

    expect(mockGenerator.mock.calls).toEqual([
      [
        {
          absoluteManifestFilename,
          filename: 'a',
          previouslyGeneratedContent: undefined,
          existingContent: undefined
        }
      ]
    ]);
  });

  it('does not pass other filenames to a generator if no other files exist', () => {
    const files = [{filename: 'a', filetype}];
    const mockGenerator = jest.fn();
    const generators = [mockGenerator];
    const loadedFile = {filename: 'a', filetype};

    generateFile({absoluteManifestFilename, files, generators}, loadedFile);

    expect(mockGenerator.mock.calls).toEqual([
      [
        {
          absoluteManifestFilename,
          filename: 'a',
          previouslyGeneratedContent: undefined,
          existingContent: undefined
        }
      ]
    ]);
  });

  it('throws if a generator caused an error', () => {
    const generators = [
      () => {
        throw new Error('GeneratorError');
      }
    ];

    const loadedFile = {filename: 'a', filetype};

    expect(() =>
      generateFile({absoluteManifestFilename, generators}, loadedFile)
    ).toThrowError(
      new Error(
        "File 'a' cannot be generated because a generator caused an error. Details: GeneratorError"
      )
    );
  });

  it('throws if a generator generates invalid content', () => {
    const generators = [() => 0];
    const loadedFile = {filename: 'a', filetype};

    expect(() =>
      generateFile({absoluteManifestFilename, generators}, loadedFile)
    ).toThrowError(
      new Error(
        "File 'a' cannot be generated because a generator generates invalid content. Details: The generatedContent should be string."
      )
    );
  });
});
