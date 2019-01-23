import {TestEnv} from './test-env';

import {PatcherArgs, patchFile} from '..';

describe('patchFile', () => {
  let testEnv: TestEnv;

  beforeEach(() => {
    testEnv = new TestEnv();
  });

  it('returns the file together with its generated content', () => {
    const {
      readContent,
      readContentData,
      rootDirname,
      loadedManifest,
      fileWithDeserializer
    } = testEnv;

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

    const {filename, initialContent} = fileWithDeserializer;
    const loadedFile = {...fileWithDeserializer, readContentData, readContent};
    const patchers = [mockPatcher1, mockPatcher2];

    expect(patchFile({...loadedManifest, patchers}, loadedFile)).toEqual({
      ...loadedFile,
      generatedContent: [...initialContent, 'baz', 'qux']
    });

    expect(mockPatcher1.mock.calls).toEqual([
      [{filename, rootDirname, generatedContent: initialContent, readContent}]
    ]);

    expect(mockPatcher2.mock.calls).toEqual([
      [
        {
          filename,
          rootDirname,
          generatedContent: [...initialContent, 'baz'],
          readContent
        }
      ]
    ]);
  });

  it('throws if a patcher caused an error', () => {
    const {loadedManifest, file} = testEnv;

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
    const {loadedManifest, file} = testEnv;
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
      const {loadedManifest, file} = testEnv;

      expect(patchFile(loadedManifest, file)).toEqual({
        ...file,
        generatedContent: file.initialContent
      });
    });
  });
});
