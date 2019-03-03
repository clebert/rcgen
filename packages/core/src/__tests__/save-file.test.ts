import {TestEnv} from './test-env';

import path from 'path';
import {saveFile} from '..';

describe('saveFile', () => {
  it('writes the generated content to the file', () => {
    const {
      mockSerializer,
      absoluteFilename,
      absoluteDirname,
      loadedManifest,
      file
    } = new TestEnv('a/b');

    const generatedContent = ['baz'];
    const patchedFile = {...file, generatedContent};

    expect(saveFile(loadedManifest, patchedFile)).toBe(true);

    expect(mockSerializer.mock.calls).toEqual([[generatedContent]]);
    expect(TestEnv.mockMkdirpSync.mock.calls).toEqual([[absoluteDirname]]);

    expect(TestEnv.mockWriteFileSync.mock.calls).toEqual([
      [absoluteFilename, TestEnv.serializeJson(generatedContent)]
    ]);
  });

  it('does not attempt to write the generated content to the file if it matches the read content of the file', () => {
    const {
      mockSerializer,
      readContent,
      readContentData,
      loadedManifest,
      file
    } = new TestEnv();

    const patchedFile = {
      ...file,
      readContentData,
      generatedContent: readContent
    };

    expect(saveFile(loadedManifest, patchedFile)).toBe(false);

    expect(mockSerializer.mock.calls).toEqual([[readContent]]);
    expect(TestEnv.mockMkdirpSync.mock.calls).toEqual([]);
    expect(TestEnv.mockWriteFileSync.mock.calls).toEqual([]);
  });

  it('throws if the file conflicts with an existing file', () => {
    const {absoluteRootDirname, loadedManifest, file} = new TestEnv();

    TestEnv.mockExistsSync.mockImplementation(
      filename => filename === path.join(absoluteRootDirname, 'c')
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
    const {mockSerializer, loadedManifest, file} = new TestEnv();

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
    const {readContentData, loadedManifest, file} = new TestEnv();
    const patchedFile = {...file, readContentData, generatedContent: ['baz']};

    expect(() => saveFile(loadedManifest, patchedFile)).toThrowError(
      new Error(
        "File 'a' cannot be saved because its generated content differs from its read content."
      )
    );
  });

  it('throws if the required subdirectories of the file could not be created', () => {
    const {loadedManifest, file} = new TestEnv();

    TestEnv.mockMkdirpSync.mockImplementation(() => {
      throw new Error('MkdirpSyncError');
    });

    const patchedFile = {...file, generatedContent: ['baz']};

    expect(() => saveFile(loadedManifest, patchedFile)).toThrowError(
      new Error(
        "File 'a' cannot be saved because its required subdirectories could not be created. Details: MkdirpSyncError"
      )
    );
  });

  it('throws if the generated content of the file could not be written', () => {
    const {loadedManifest, file} = new TestEnv();

    TestEnv.mockWriteFileSync.mockImplementation(() => {
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
        mockSerializer,
        readContentData,
        absoluteFilename,
        absoluteDirname,
        loadedManifest,
        file
      } = new TestEnv('a/b');

      const generatedContent = ['baz'];
      const patchedFile = {...file, readContentData, generatedContent};

      expect(saveFile(loadedManifest, patchedFile, true)).toBe(true);

      expect(mockSerializer.mock.calls).toEqual([[generatedContent]]);
      expect(TestEnv.mockMkdirpSync.mock.calls).toEqual([[absoluteDirname]]);

      expect(TestEnv.mockWriteFileSync.mock.calls).toEqual([
        [absoluteFilename, TestEnv.serializeJson(generatedContent)]
      ]);
    });
  });
});
