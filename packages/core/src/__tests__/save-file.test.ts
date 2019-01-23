import {TestEnv} from './test-env';

import {saveFile} from '..';

describe('saveFile', () => {
  let testEnv: TestEnv;

  beforeEach(() => {
    testEnv = new TestEnv();
  });

  it('writes the generated content to the file', () => {
    const {
      mockWriteFileSync,
      mockSerializer,
      loadedManifest,
      absoluteFilename,
      file,
      serializeJson
    } = testEnv;

    const generatedContent = ['baz'];
    const patchedFile = {...file, generatedContent};

    expect(saveFile(loadedManifest, patchedFile)).toBe(true);

    expect(mockSerializer.mock.calls).toEqual([[generatedContent]]);

    expect(mockWriteFileSync.mock.calls).toEqual([
      [absoluteFilename, serializeJson(generatedContent)]
    ]);
  });

  it('does not attempt to write the generated content to the file if it matches the read content of the file', () => {
    const {
      mockWriteFileSync,
      mockSerializer,
      readContent,
      readContentData,
      loadedManifest,
      file
    } = testEnv;

    const patchedFile = {
      ...file,
      readContentData,
      generatedContent: readContent
    };

    expect(saveFile(loadedManifest, patchedFile)).toBe(false);

    expect(mockSerializer.mock.calls).toEqual([[readContent]]);
    expect(mockWriteFileSync.mock.calls).toEqual([]);
  });

  it('throws if the file conflicts with an existing file', () => {
    const {mockExistsSync, rootDirname, loadedManifest, file} = testEnv;

    mockExistsSync.mockImplementation(
      filename => filename === `${rootDirname}/c`
    );

    const patchedFile = {
      ...file,
      conflictingFilenames: ['b', 'c'],
      generatedContent: ['baz']
    };

    expect(() => saveFile(loadedManifest, patchedFile)).toThrowError(
      new Error(
        "File 'a' cannot be saved because it conflicts with the existing file 'c'."
      )
    );
  });

  it('throws if the generated content of the file could not be serialized', () => {
    const {mockSerializer, loadedManifest, file} = testEnv;

    mockSerializer.mockImplementation(() => {
      throw new Error('SerializerError');
    });

    const patchedFile = {...file, generatedContent: ['baz']};

    expect(() => saveFile(loadedManifest, patchedFile)).toThrowError(
      new Error(
        "File 'a' cannot be saved because its generated content could not be serialized. Details: SerializerError"
      )
    );
  });

  it('throws if the generated content of the file differs from the read content of the file', () => {
    const {readContentData, loadedManifest, file} = testEnv;
    const patchedFile = {...file, readContentData, generatedContent: ['baz']};

    expect(() => saveFile(loadedManifest, patchedFile)).toThrowError(
      new Error(
        "File 'a' cannot be saved because its generated content differs from its read content."
      )
    );
  });

  it('throws if the generated content of the file could not be written', () => {
    const {mockWriteFileSync, loadedManifest, file} = testEnv;

    mockWriteFileSync.mockImplementation(() => {
      throw new Error('WriteFileSyncError');
    });

    const patchedFile = {...file, generatedContent: ['baz']};

    expect(() => saveFile(loadedManifest, patchedFile)).toThrowError(
      new Error(
        "File 'a' cannot be saved because its generated content could not be written. Details: WriteFileSyncError"
      )
    );
  });

  describe('in force mode', () => {
    it('writes the generated content to the file although it differs from the read content of the file', () => {
      const {
        mockWriteFileSync,
        mockSerializer,
        readContentData,
        loadedManifest,
        absoluteFilename,
        file,
        serializeJson
      } = testEnv;

      const generatedContent = ['baz'];
      const patchedFile = {...file, readContentData, generatedContent};

      expect(saveFile(loadedManifest, patchedFile, true)).toBe(true);

      expect(mockSerializer.mock.calls).toEqual([[generatedContent]]);

      expect(mockWriteFileSync.mock.calls).toEqual([
        [absoluteFilename, serializeJson(generatedContent)]
      ]);
    });
  });
});
