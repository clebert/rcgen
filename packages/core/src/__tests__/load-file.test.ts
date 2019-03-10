import {TestEnv} from './test-env';

import {loadFile} from '..';

describe('loadFile', () => {
  it('returns the file together with its read but not deserialized content', () => {
    const {
      readContentData,
      loadedManifest,
      absoluteFilename,
      file
    } = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);
    TestEnv.mockReadFileSync.mockReturnValue(readContentData);

    expect(loadFile({...loadedManifest, files: [file]}, 'a')).toEqual({
      ...file,
      readContentData
    });

    expect(TestEnv.mockExistsSync.mock.calls).toEqual([[absoluteFilename]]);
    expect(TestEnv.mockReadFileSync.mock.calls).toEqual([[absoluteFilename]]);
  });

  it('returns the file together with its read and deserialized content', () => {
    const {
      mockDeserializer,
      readContent,
      readContentData,
      loadedManifest,
      absoluteFilename,
      fileWithDeserializer
    } = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);
    TestEnv.mockReadFileSync.mockReturnValue(readContentData);

    expect(
      loadFile({...loadedManifest, files: [fileWithDeserializer]}, 'a')
    ).toEqual({...fileWithDeserializer, readContentData, readContent});

    expect(TestEnv.mockExistsSync.mock.calls).toEqual([[absoluteFilename]]);
    expect(TestEnv.mockReadFileSync.mock.calls).toEqual([[absoluteFilename]]);

    const {absoluteManifestFilename} = loadedManifest;

    expect(mockDeserializer.mock.calls).toEqual([
      [{absoluteManifestFilename, filename: 'a', readContentData}]
    ]);
  });

  it('returns undefined if the file is not included', () => {
    const {loadedManifest, file} = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(false);

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
    const {loadedManifest, file} = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);

    expect(
      loadFile(
        {...loadedManifest, files: [file], includedFilenames: []},
        file.filename
      )
    ).toBeUndefined();

    expect(TestEnv.mockExistsSync.mock.calls).toEqual([]);
    expect(TestEnv.mockReadFileSync.mock.calls).toEqual([]);
  });

  it('does not attempt to read the content of the file if it does not exist', () => {
    const {loadedManifest, absoluteFilename, file} = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(false);

    expect(loadFile({...loadedManifest, files: [file]}, file.filename)).toEqual(
      file
    );

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
      loadFile({...loadedManifest, files: [file]}, file.filename)
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because it could not be accessed. Details: ExistsSyncError"
      )
    );
  });

  it('throws if the content of the file could not be read', () => {
    const {loadedManifest, file} = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);

    TestEnv.mockReadFileSync.mockImplementation(() => {
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
      mockDeserializer,
      readContentData,
      loadedManifest,
      fileWithDeserializer
    } = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);
    TestEnv.mockReadFileSync.mockReturnValue(readContentData);

    mockDeserializer.mockImplementation(() => {
      throw new Error('DeserializerError');
    });

    expect(() =>
      loadFile({...loadedManifest, files: [fileWithDeserializer]}, 'a')
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because its read content could not be deserialized. Details: DeserializerError"
      )
    );
  });

  it('throws if the read content of the file is invalid', () => {
    const {loadedManifest, fileWithDeserializer} = new TestEnv('a');

    TestEnv.mockExistsSync.mockReturnValue(true);
    TestEnv.mockReadFileSync.mockReturnValue(TestEnv.serializeJson('bar'));

    expect(() =>
      loadFile({...loadedManifest, files: [fileWithDeserializer]}, 'a')
    ).toThrowError(
      new Error(
        "File 'a' cannot be loaded because its read content is invalid. Details: The readContent should be array."
      )
    );
  });
});
