import {
  filetype,
  mockExistsSync,
  mockMkdirpSync,
  mockSerializer,
  mockWriteFileSync,
  serializeJson
} from './test-env';

import {saveFile} from '..';

describe('saveFile', () => {
  const absoluteManifestFilename = '/path/to/m';
  const generatedContent = 'foo';
  const generatedContentData = serializeJson(generatedContent);

  it('writes the generated content data to the file', () => {
    const patchedFile = {filename: 'a/b', filetype, generatedContent};

    expect(saveFile({absoluteManifestFilename}, patchedFile)).toBe(true);

    expect(mockSerializer.mock.calls).toEqual([
      [{absoluteManifestFilename, filename: 'a/b', content: generatedContent}]
    ]);

    expect(mockMkdirpSync.mock.calls).toEqual([['/path/to/a']]);

    expect(mockWriteFileSync.mock.calls).toEqual([
      ['/path/to/a/b', generatedContentData]
    ]);
  });

  it('does not attempt to write the generated content data to the file if it matches the existing content data of the file', () => {
    const patchedFile = {
      filename: 'a',
      filetype,
      existingContentData: generatedContentData,
      generatedContent
    };

    expect(saveFile({absoluteManifestFilename}, patchedFile)).toBe(false);

    expect(mockSerializer.mock.calls).toEqual([
      [{absoluteManifestFilename, filename: 'a', content: generatedContent}]
    ]);

    expect(mockMkdirpSync.mock.calls).toEqual([]);
    expect(mockWriteFileSync.mock.calls).toEqual([]);
  });

  it('throws if the file conflicts with an existing file', () => {
    mockExistsSync.mockImplementation(filename => filename === '/path/to/c');

    const patchedFile = {
      filename: 'a',
      filetype,
      conflictingFilenames: ['b', 'c'],
      generatedContent
    };

    expect(() =>
      saveFile({absoluteManifestFilename}, patchedFile)
    ).toThrowError(
      new Error(
        "File 'a' cannot be saved because it conflicts with the existing file 'c'."
      )
    );
  });

  it('throws if the generated content data of the file could not be serialized', () => {
    const patchedFile = {filename: 'a', filetype, generatedContent};

    mockSerializer.mockImplementation(() => {
      throw new Error('SerializerError');
    });

    expect(() =>
      saveFile({absoluteManifestFilename}, patchedFile)
    ).toThrowError(
      new Error(
        "File 'a' cannot be saved because its generated content data could not be serialized. Details: SerializerError"
      )
    );
  });

  it('throws if the generated content data of the file differs from the existing content data of the file', () => {
    const patchedFile = {
      filename: 'a',
      filetype,
      existingContentData: serializeJson('bar'),
      generatedContent
    };

    expect(() =>
      saveFile({absoluteManifestFilename}, patchedFile)
    ).toThrowError(
      new Error(
        "File 'a' cannot be saved because its generated content data differs from its existing content data."
      )
    );
  });

  it('throws if the required subdirectories of the file could not be created', () => {
    mockMkdirpSync.mockImplementation(() => {
      throw new Error('MkdirpSyncError');
    });

    const patchedFile = {filename: 'a', filetype, generatedContent};

    expect(() =>
      saveFile({absoluteManifestFilename}, patchedFile)
    ).toThrowError(
      new Error(
        "File 'a' cannot be saved because its required subdirectories could not be created. Details: MkdirpSyncError"
      )
    );
  });

  it('throws if the generated content data of the file could not be written', () => {
    mockWriteFileSync.mockImplementation(() => {
      throw new Error('WriteFileSyncError');
    });

    const patchedFile = {filename: 'a', filetype, generatedContent};

    expect(() =>
      saveFile({absoluteManifestFilename}, patchedFile)
    ).toThrowError(
      new Error(
        "File 'a' cannot be saved because its generated content data could not be written. Details: WriteFileSyncError"
      )
    );
  });

  describe('in force mode', () => {
    it('writes the generated content data to the file although it differs from the existing content data of the file', () => {
      const patchedFile = {
        filename: 'a/b',
        filetype,
        existingContentData: serializeJson('bar'),
        generatedContent
      };

      expect(saveFile({absoluteManifestFilename}, patchedFile, true)).toBe(
        true
      );

      expect(mockSerializer.mock.calls).toEqual([
        [{absoluteManifestFilename, filename: 'a/b', content: generatedContent}]
      ]);

      expect(mockMkdirpSync.mock.calls).toEqual([['/path/to/a']]);

      expect(mockWriteFileSync.mock.calls).toEqual([
        ['/path/to/a/b', generatedContentData]
      ]);
    });
  });
});
