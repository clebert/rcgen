import {TestEnv} from './test-env';

import {PatcherArgs, patchFile} from '..';

describe('patchFile', () => {
  it('returns the file together with its generated content', () => {
    const {
      readContent,
      readContentData,
      loadedManifest,
      fileWithDeserializer
    } = new TestEnv('b');

    const mockPatcher1 = jest.fn(
      ({generatedContent}: PatcherArgs<string[]>) => [
        ...generatedContent,
        'baz'
      ]
    );

    const mockPatcher2 = jest.fn(
      ({generatedContent}: PatcherArgs<string[]>) => [
        ...generatedContent,
        'qux'
      ]
    );

    const patchers = [mockPatcher1, mockPatcher2];
    const {initialContent} = fileWithDeserializer;

    const loadedFileA = {...fileWithDeserializer, filename: 'a'};
    const loadedFileB = {...fileWithDeserializer, readContentData, readContent};
    const loadedFileC = {...fileWithDeserializer, filename: 'c'};

    expect(
      patchFile(
        {
          ...loadedManifest,
          files: [loadedFileA, loadedFileB, loadedFileC],
          patchers
        },
        loadedFileB
      )
    ).toEqual({
      ...loadedFileB,
      generatedContent: [...initialContent, 'baz', 'qux']
    });

    const {absoluteManifestFilename} = loadedManifest;

    expect(mockPatcher1.mock.calls).toEqual([
      [
        {
          absoluteManifestFilename,
          filename: 'b',
          generatedContent: initialContent,
          readContent,
          otherFilenames: ['a', 'c']
        }
      ]
    ]);

    expect(mockPatcher2.mock.calls).toEqual([
      [
        {
          absoluteManifestFilename,
          filename: 'b',
          generatedContent: [...initialContent, 'baz'],
          readContent,
          otherFilenames: ['a', 'c']
        }
      ]
    ]);
  });

  it('throws if a patcher caused an error', () => {
    const {loadedManifest, file} = new TestEnv('a');

    const patchers = [
      () => {
        throw new Error('PatcherError');
      }
    ];

    expect(() => patchFile({...loadedManifest, patchers}, file)).toThrowError(
      new Error(
        "File 'a' cannot be patched because a patcher caused an error. Details: PatcherError"
      )
    );
  });

  it('throws if the generated content of the file will become invalid', () => {
    const {loadedManifest, file} = new TestEnv('a');

    const mockPatcher1 = jest.fn(() => 'baz');
    const mockPatcher2 = jest.fn();

    const patchers = [mockPatcher1, mockPatcher2];

    expect(() => patchFile({...loadedManifest, patchers}, file)).toThrowError(
      new Error(
        "File 'a' cannot be patched because its generated content will become invalid. Details: The generatedContent should be array."
      )
    );

    expect(mockPatcher1).toHaveBeenCalledTimes(1);
    expect(mockPatcher2).not.toHaveBeenCalled();
  });

  describe('without patchers', () => {
    it('returns the file together with its initial content instead of generated content', () => {
      const {loadedManifest, file} = new TestEnv('a');

      expect(patchFile(loadedManifest, file)).toEqual({
        ...file,
        generatedContent: file.initialContent
      });
    });
  });
});
