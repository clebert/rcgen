import {TestEnv} from './test-env';

import {loadFile} from '..';

describe('loadFile', () => {
  let testEnv: TestEnv;

  beforeEach(() => {
    testEnv = new TestEnv();
  });

  it('returns the file together with its read but not deserialized content', () => {
    const {
      mockExistsSync,
      mockReadFileSync,
      readContentData,
      loadedManifest,
      absoluteFilename,
      file
    } = testEnv;

    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(readContentData);

    const {filename} = file;

    expect(loadFile({...loadedManifest, files: [file]}, filename)).toEqual({
      ...file,
      readContentData
    });

    expect(mockExistsSync.mock.calls).toEqual([[absoluteFilename]]);
    expect(mockReadFileSync.mock.calls).toEqual([[absoluteFilename]]);
  });

  it('returns the file together with its read and deserialized content', () => {
    const {
      mockExistsSync,
      mockReadFileSync,
      mockDeserializer,
      readContent,
      readContentData,
      loadedManifest,
      absoluteFilename,
      fileWithDeserializer
    } = testEnv;

    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(readContentData);

    const {filename} = fileWithDeserializer;

    expect(
      loadFile({...loadedManifest, files: [fileWithDeserializer]}, filename)
    ).toEqual({...fileWithDeserializer, readContentData, readContent});

    expect(mockExistsSync.mock.calls).toEqual([[absoluteFilename]]);
    expect(mockReadFileSync.mock.calls).toEqual([[absoluteFilename]]);
    expect(mockDeserializer.mock.calls).toEqual([[readContentData]]);
  });

  it('returns undefined if the file is not included', () => {
    const {mockExistsSync, loadedManifest, file} = testEnv;

    mockExistsSync.mockReturnValue(false);

    const testCases = [
      {included: [1, 1, 1]},
      {includedFilenames: [], included: [0, 0, 0]},
      {excludedFilenames: [], included: [1, 1, 1]},
      {includedFilenames: ['*'], included: [1, 1, 0]},
      {excludedFilenames: ['*'], included: [0, 0, 1]},
      {includedFilenames: ['!*'], included: [1, 0, 0]},
      {excludedFilenames: ['!*'], included: [0, 1, 1]},
      {includedFilenames: ['*/*'], included: [0, 0, 1]},
      {excludedFilenames: ['*/*'], included: [1, 1, 0]},
      {includedFilenames: ['**/*'], included: [1, 1, 1]},
      {excludedFilenames: ['**/*'], included: [0, 0, 0]},
      {includedFilenames: ['*', '*/*'], included: [1, 1, 1]},
      {excludedFilenames: ['*', '*/*'], included: [0, 0, 0]},
      {includedFilenames: [], excludedFilenames: [], included: [0, 0, 0]},
      {includedFilenames: ['*'], excludedFilenames: ['!*'], included: [0, 1, 0]}
    ];

    for (const {includedFilenames, excludedFilenames, included} of testCases) {
      ['!a', '.b', 'c/d'].forEach((filename, index) => {
        const files = [{...file, filename}];

        expect(
          loadFile(
            {...loadedManifest, files, includedFilenames, excludedFilenames},
            filename
          )
        ).toEqual(included[index] ? files[0] : undefined);
      });
    }
  });

  it('does not attempt to access the file if it is not included', () => {
    const {mockExistsSync, mockReadFileSync, loadedManifest, file} = testEnv;

    mockExistsSync.mockReturnValue(true);

    expect(
      loadFile(
        {...loadedManifest, files: [file], includedFilenames: []},
        file.filename
      )
    ).toBeUndefined();

    expect(mockExistsSync.mock.calls).toEqual([]);
    expect(mockReadFileSync.mock.calls).toEqual([]);
  });

  it('does not attempt to read the content of the file if it does not exist', () => {
    const {
      mockExistsSync,
      mockReadFileSync,
      loadedManifest,
      absoluteFilename,
      file
    } = testEnv;

    mockExistsSync.mockReturnValue(false);

    expect(loadFile({...loadedManifest, files: [file]}, file.filename)).toEqual(
      file
    );

    expect(mockExistsSync.mock.calls).toEqual([[absoluteFilename]]);
    expect(mockReadFileSync.mock.calls).toEqual([]);
  });

  it('throws if the file is undefined', () => {
    const {loadedManifest} = testEnv;

    expect(() => loadFile(loadedManifest, 'a')).toThrowError(
      new Error("File 'a' cannot be loaded because it is undefined.")
    );
  });

  it('throws if the file could not be accessed', () => {
    const {mockExistsSync, loadedManifest, file} = testEnv;

    mockExistsSync.mockImplementation(() => {
      throw new Error('ExistsSyncError');
    });

    expect(() =>
      loadFile({...loadedManifest, files: [file]}, file.filename)
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because it could not be accessed. Details: ExistsSyncError"
      )
    );
  });

  it('throws if the content of the file could not be read', () => {
    const {mockExistsSync, mockReadFileSync, loadedManifest, file} = testEnv;

    mockExistsSync.mockReturnValue(true);

    mockReadFileSync.mockImplementation(() => {
      throw new Error('ReadFileSyncError');
    });

    expect(() =>
      loadFile({...loadedManifest, files: [file]}, file.filename)
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because its content could not be read. Details: ReadFileSyncError"
      )
    );
  });

  it('throws if the read content of the file could not be deserialized', () => {
    const {
      mockExistsSync,
      mockReadFileSync,
      mockDeserializer,
      readContentData,
      loadedManifest,
      fileWithDeserializer
    } = testEnv;

    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(readContentData);

    mockDeserializer.mockImplementation(() => {
      throw new Error('DeserializerError');
    });

    const {filename} = fileWithDeserializer;

    expect(() =>
      loadFile({...loadedManifest, files: [fileWithDeserializer]}, filename)
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because its read content could not be deserialized. Details: DeserializerError"
      )
    );
  });

  it('throws if the read content of the file is invalid', () => {
    const {
      mockExistsSync,
      mockReadFileSync,
      loadedManifest,
      fileWithDeserializer,
      serializeJson
    } = testEnv;

    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(serializeJson('bar'));

    const {filename} = fileWithDeserializer;

    expect(() =>
      loadFile({...loadedManifest, files: [fileWithDeserializer]}, filename)
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because its read content is invalid. Details: The readContent should be array."
      )
    );
  });
});
