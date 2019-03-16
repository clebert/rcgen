import {
  filetype,
  filetypeWithDeserializer,
  mockDeserializer,
  mockExistsSync,
  mockReadFileSync,
  serializeJson
} from './test-env';

import {loadFile} from '..';

describe('loadFile', () => {
  const absoluteManifestFilename = '/path/to/m';
  const existingContent = 'foo';
  const existingContentData = serializeJson(existingContent);

  it('only reads the existing content data of the file', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(existingContentData);

    const file = {filename: 'a', filetype};

    expect(loadFile({absoluteManifestFilename, files: [file]}, 'a')).toEqual({
      ...file,
      existingContentData
    });

    expect(mockExistsSync.mock.calls).toEqual([['/path/to/a']]);
    expect(mockReadFileSync.mock.calls).toEqual([['/path/to/a']]);
  });

  it('deserializes the existing content of the file', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(existingContentData);

    const file = {filename: 'a', filetype: filetypeWithDeserializer};

    expect(loadFile({absoluteManifestFilename, files: [file]}, 'a')).toEqual({
      ...file,
      existingContentData,
      existingContent
    });

    expect(mockExistsSync.mock.calls).toEqual([['/path/to/a']]);
    expect(mockReadFileSync.mock.calls).toEqual([['/path/to/a']]);

    expect(mockDeserializer.mock.calls).toEqual([
      [
        {
          absoluteManifestFilename,
          filename: 'a',
          contentData: existingContentData
        }
      ]
    ]);
  });

  it('does not attempt to access the file if it is not included', () => {
    mockExistsSync.mockReturnValue(true);

    const file = {filename: 'a', filetype};

    expect(
      loadFile(
        {absoluteManifestFilename, files: [file], includedFilenamePatterns: []},
        'a'
      )
    ).toBeUndefined();

    expect(mockExistsSync.mock.calls).toEqual([]);
    expect(mockReadFileSync.mock.calls).toEqual([]);
  });

  it('does not attempt to read the existing content data of the file if it does not exist', () => {
    mockExistsSync.mockReturnValue(false);

    const file = {filename: 'a', filetype};

    expect(loadFile({absoluteManifestFilename, files: [file]}, 'a')).toEqual(
      file
    );

    expect(mockExistsSync.mock.calls).toEqual([['/path/to/a']]);
    expect(mockReadFileSync.mock.calls).toEqual([]);
  });

  it('throws if the file is undefined', () => {
    expect(() => loadFile({absoluteManifestFilename}, 'a')).toThrowError(
      new Error("File 'a' cannot be loaded because it is undefined.")
    );
  });

  it('throws if the file could not be accessed', () => {
    mockExistsSync.mockImplementation(() => {
      throw new Error('ExistsSyncError');
    });

    const file = {filename: 'a', filetype};

    expect(() =>
      loadFile({absoluteManifestFilename, files: [file]}, 'a')
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because it could not be accessed. Details: ExistsSyncError"
      )
    );
  });

  it('throws if the existing content data of the file could not be read', () => {
    mockExistsSync.mockReturnValue(true);

    mockReadFileSync.mockImplementation(() => {
      throw new Error('ReadFileSyncError');
    });

    const file = {filename: 'a', filetype};

    expect(() =>
      loadFile({absoluteManifestFilename, files: [file]}, 'a')
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because its existing content data could not be read. Details: ReadFileSyncError"
      )
    );
  });

  it('throws if the existing content of the file could not be deserialized', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(existingContentData);

    mockDeserializer.mockImplementation(() => {
      throw new Error('DeserializerError');
    });

    const file = {filename: 'a', filetype: filetypeWithDeserializer};

    expect(() =>
      loadFile({absoluteManifestFilename, files: [file]}, 'a')
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because its existing content could not be deserialized. Details: DeserializerError"
      )
    );
  });

  it('throws if the existing content of the file is invalid', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(serializeJson(0));

    const file = {filename: 'a', filetype: filetypeWithDeserializer};

    expect(() =>
      loadFile({absoluteManifestFilename, files: [file]}, 'a')
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because its existing content is invalid. Details: The existingContent should be string."
      )
    );
  });
});
