import {filetype} from './test-env';

import {patchFile} from '..';

describe('patchFile', () => {
  const absoluteManifestFilename = '/path/to/m';

  it('patches the file by calling multiple patchers one after the other', () => {
    const mockPatcher1 = jest.fn(() => 'bar');
    const mockPatcher2 = jest.fn(() => undefined);
    const mockPatcher3 = jest.fn(() => 'baz');

    const patchers = [mockPatcher1, mockPatcher2, mockPatcher3];
    const loadedFile = {filename: 'a', filetype, existingContent: 'foo'};

    expect(patchFile({absoluteManifestFilename, patchers}, loadedFile)).toEqual(
      {...loadedFile, generatedContent: 'baz'}
    );

    const patcherArgs = {
      absoluteManifestFilename,
      filename: 'a',
      generatedContent: undefined,
      existingContent: 'foo'
    };

    expect(mockPatcher1.mock.calls).toEqual([[patcherArgs]]);

    expect(mockPatcher2.mock.calls).toEqual([
      [{...patcherArgs, generatedContent: 'bar'}]
    ]);

    expect(mockPatcher3.mock.calls).toEqual([
      [{...patcherArgs, generatedContent: 'bar'}]
    ]);
  });

  it('patches the file if the only patcher generates falsy content', () => {
    const patchers = [() => ''];
    const loadedFile = {filename: 'a', filetype};

    expect(patchFile({absoluteManifestFilename, patchers}, loadedFile)).toEqual(
      {...loadedFile, generatedContent: ''}
    );
  });

  it('does not patch the file if the only patcher generates no content', () => {
    const patchers = [() => undefined];
    const loadedFile = {filename: 'a', filetype};

    expect(patchFile({absoluteManifestFilename, patchers}, loadedFile)).toBe(
      null
    );
  });

  it('does not patch the file if no patchers exist', () => {
    const loadedFile = {filename: 'a', filetype};

    expect(patchFile({absoluteManifestFilename}, loadedFile)).toBe(null);
  });

  it('passes other filenames to a patcher if other files exist', () => {
    const files = [
      {filename: 'a', filetype},
      {filename: 'b', filetype},
      {filename: 'c', filetype}
    ];

    const mockPatcher = jest.fn();
    const patchers = [mockPatcher];
    const loadedFile = {filename: 'a', filetype};

    patchFile({absoluteManifestFilename, files, patchers}, loadedFile);

    expect(mockPatcher.mock.calls).toEqual([
      [
        {
          absoluteManifestFilename,
          filename: 'a',
          generatedContent: undefined,
          existingContent: undefined
        }
      ]
    ]);
  });

  it('does not pass other filenames to a patcher if no other files exist', () => {
    const files = [{filename: 'a', filetype}];
    const mockPatcher = jest.fn();
    const patchers = [mockPatcher];
    const loadedFile = {filename: 'a', filetype};

    patchFile({absoluteManifestFilename, files, patchers}, loadedFile);

    expect(mockPatcher.mock.calls).toEqual([
      [
        {
          absoluteManifestFilename,
          filename: 'a',
          generatedContent: undefined,
          existingContent: undefined
        }
      ]
    ]);
  });

  it('throws if a patcher caused an error', () => {
    const patchers = [
      () => {
        throw new Error('PatcherError');
      }
    ];

    const loadedFile = {filename: 'a', filetype};

    expect(() =>
      patchFile({absoluteManifestFilename, patchers}, loadedFile)
    ).toThrowError(
      new Error(
        "File 'a' cannot be patched because a patcher caused an error. Details: PatcherError"
      )
    );
  });

  it('throws if a patcher generates invalid content', () => {
    const patchers = [() => 0];
    const loadedFile = {filename: 'a', filetype};

    expect(() =>
      patchFile({absoluteManifestFilename, patchers}, loadedFile)
    ).toThrowError(
      new Error(
        "File 'a' cannot be patched because a patcher generates invalid content. Details: The generatedContent should be string."
      )
    );
  });
});
