import {TestEnv} from './test-env';

import {loadFile} from '..';

describe('loadFile', () => {
  it('only reads the exisiting content data of the file', () => {
    const {
      exisitingContentData,
      loadedManifest,
      absoluteFilename,
      file
    } = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);
    TestEnv.mockReadFileSync.mockReturnValue(exisitingContentData);

    expect(loadFile({...loadedManifest, files: [file]}, 'a')).toEqual({
      ...file,
      exisitingContentData
    });

    expect(TestEnv.mockExistsSync.mock.calls).toEqual([[absoluteFilename]]);
    expect(TestEnv.mockReadFileSync.mock.calls).toEqual([[absoluteFilename]]);
  });

  it('deserializes the exisiting content of the file', () => {
    const {
      mockDeserializer,
      exisitingContent,
      exisitingContentData,
      loadedManifest,
      absoluteFilename,
      fileWithDeserializer
    } = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);
    TestEnv.mockReadFileSync.mockReturnValue(exisitingContentData);

    expect(
      loadFile({...loadedManifest, files: [fileWithDeserializer]}, 'a')
    ).toEqual({
      ...fileWithDeserializer,
      exisitingContentData,
      exisitingContent
    });

    expect(TestEnv.mockExistsSync.mock.calls).toEqual([[absoluteFilename]]);
    expect(TestEnv.mockReadFileSync.mock.calls).toEqual([[absoluteFilename]]);

    const {absoluteManifestFilename} = loadedManifest;

    expect(mockDeserializer.mock.calls).toEqual([
      [
        {
          absoluteManifestFilename,
          filename: 'a',
          contentData: exisitingContentData
        }
      ]
    ]);
  });

  it('does not attempt to access the file if it is not included', () => {
    const {loadedManifest, file} = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);

    expect(
      loadFile(
        {...loadedManifest, files: [file], includedFilenamePatterns: []},
        'a'
      )
    ).toBeUndefined();

    expect(TestEnv.mockExistsSync.mock.calls).toEqual([]);
    expect(TestEnv.mockReadFileSync.mock.calls).toEqual([]);
  });

  it('does not attempt to read the exisiting content data of the file if it does not exist', () => {
    const {loadedManifest, absoluteFilename, file} = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(false);

    expect(loadFile({...loadedManifest, files: [file]}, 'a')).toEqual(file);

    expect(TestEnv.mockExistsSync.mock.calls).toEqual([[absoluteFilename]]);
    expect(TestEnv.mockReadFileSync.mock.calls).toEqual([]);
  });

  it('throws if the file is undefined', () => {
    const {loadedManifest} = new TestEnv('a');

    expect(() => loadFile(loadedManifest, 'a')).toThrowError(
      new Error("File 'a' cannot be loaded because it is undefined.")
    );
  });

  it('throws if the file could not be accessed', () => {
    const {loadedManifest, file} = new TestEnv('a');

    TestEnv.mockExistsSync.mockImplementation(() => {
      throw new Error('ExistsSyncError');
    });

    expect(() =>
      loadFile({...loadedManifest, files: [file]}, 'a')
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because it could not be accessed. Details: ExistsSyncError"
      )
    );
  });

  it('throws if the exisiting content data of the file could not be read', () => {
    const {loadedManifest, file} = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);

    TestEnv.mockReadFileSync.mockImplementation(() => {
      throw new Error('ReadFileSyncError');
    });

    expect(() =>
      loadFile({...loadedManifest, files: [file]}, 'a')
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because its exisiting content data could not be read. Details: ReadFileSyncError"
      )
    );
  });

  it('throws if the exisiting content of the file could not be deserialized', () => {
    const {
      mockDeserializer,
      exisitingContentData,
      loadedManifest,
      fileWithDeserializer
    } = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);
    TestEnv.mockReadFileSync.mockReturnValue(exisitingContentData);

    mockDeserializer.mockImplementation(() => {
      throw new Error('DeserializerError');
    });

    expect(() =>
      loadFile({...loadedManifest, files: [fileWithDeserializer]}, 'a')
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because its exisiting content could not be deserialized. Details: DeserializerError"
      )
    );
  });

  it('throws if the exisiting content of the file is invalid', () => {
    const {loadedManifest, fileWithDeserializer} = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);
    TestEnv.mockReadFileSync.mockReturnValue(TestEnv.serializeJson('bar'));

    expect(() =>
      loadFile({...loadedManifest, files: [fileWithDeserializer]}, 'a')
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because its exisiting content is invalid. Details: The exisitingContent should be array."
      )
    );
  });
});
