import {TestEnv} from './test-env';

import path from 'path';
import {saveFile} from '..';

describe('saveFile', () => {
  it('writes the generated content data to the file', () => {
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

    const {absoluteManifestFilename} = loadedManifest;

    expect(mockSerializer.mock.calls).toEqual([
      [{absoluteManifestFilename, filename: 'a/b', content: generatedContent}]
    ]);

    expect(TestEnv.mockMkdirpSync.mock.calls).toEqual([[absoluteDirname]]);

    expect(TestEnv.mockWriteFileSync.mock.calls).toEqual([
      [absoluteFilename, TestEnv.serializeJson(generatedContent)]
    ]);
  });

  it('does not attempt to write the generated content data to the file if it matches the existing content data of the file', () => {
    const {
      mockSerializer,
      exisitingContent,
      exisitingContentData,
      loadedManifest,
      file
    } = new TestEnv('a');

    const generatedContent = exisitingContent;
    const patchedFile = {...file, exisitingContentData, generatedContent};

    expect(saveFile(loadedManifest, patchedFile)).toBe(false);

    const {absoluteManifestFilename} = loadedManifest;

    expect(mockSerializer.mock.calls).toEqual([
      [{absoluteManifestFilename, filename: 'a', content: generatedContent}]
    ]);

    expect(TestEnv.mockMkdirpSync.mock.calls).toEqual([]);
    expect(TestEnv.mockWriteFileSync.mock.calls).toEqual([]);
  });

  it('throws if the file conflicts with an existing file', () => {
    const {absoluteRootDirname, loadedManifest, file} = new TestEnv('a');

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

  it('throws if the generated content data of the file could not be serialized', () => {
    const {mockSerializer, loadedManifest, file} = new TestEnv('a');

    mockSerializer.mockImplementation(() => {
      throw new Error('SerializerError');
    });

    const patchedFile = {...file, generatedContent: ['baz']};

    expect(() => saveFile(loadedManifest, patchedFile)).toThrowError(
      new Error(
        "File 'a' cannot be saved because its generated content data could not be serialized. Details: SerializerError"
      )
    );
  });

  it('throws if the generated content data of the file differs from the existing content data of the file', () => {
    const {exisitingContentData, loadedManifest, file} = new TestEnv('a');

    const patchedFile = {
      ...file,
      exisitingContentData,
      generatedContent: ['baz']
    };

    expect(() => saveFile(loadedManifest, patchedFile)).toThrowError(
      new Error(
        "File 'a' cannot be saved because its generated content data differs from its existing content data."
      )
    );
  });

  it('throws if the required subdirectories of the file could not be created', () => {
    const {loadedManifest, file} = new TestEnv('a');

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

  it('throws if the generated content data of the file could not be written', () => {
    const {loadedManifest, file} = new TestEnv('a');

    TestEnv.mockWriteFileSync.mockImplementation(() => {
      throw new Error('WriteFileSyncError');
    });

    const patchedFile = {...file, generatedContent: ['baz']};

    expect(() => saveFile(loadedManifest, patchedFile)).toThrowError(
      new Error(
        "File 'a' cannot be saved because its generated content data could not be written. Details: WriteFileSyncError"
      )
    );
  });

  describe('in force mode', () => {
    it('writes the generated content data to the file although it differs from the existing content data of the file', () => {
      const {
        mockSerializer,
        exisitingContentData,
        absoluteFilename,
        absoluteDirname,
        loadedManifest,
        file
      } = new TestEnv('a/b');

      const generatedContent = ['baz'];
      const patchedFile = {...file, exisitingContentData, generatedContent};

      expect(saveFile(loadedManifest, patchedFile, true)).toBe(true);

      const {absoluteManifestFilename} = loadedManifest;

      expect(mockSerializer.mock.calls).toEqual([
        [{absoluteManifestFilename, filename: 'a/b', content: generatedContent}]
      ]);

      expect(TestEnv.mockMkdirpSync.mock.calls).toEqual([[absoluteDirname]]);

      expect(TestEnv.mockWriteFileSync.mock.calls).toEqual([
        [absoluteFilename, TestEnv.serializeJson(generatedContent)]
      ]);
    });
  });
});
