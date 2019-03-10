// tslint:disable: no-any

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn()
}));

jest.mock('mkdirp', () => ({
  sync: jest.fn()
}));

import {existsSync, readFileSync, writeFileSync} from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import {DeserializerArgs, File, LoadedManifest, SerializerArgs} from '..';

export class TestEnv {
  public static readonly mockExistsSync = (existsSync as any) as jest.Mock;
  public static readonly mockReadFileSync = (readFileSync as any) as jest.Mock;
  public static readonly mockWriteFileSync = (writeFileSync as any) as jest.Mock;
  public static readonly mockMkdirpSync = (mkdirp.sync as any) as jest.Mock;

  public static serializeJson(content: unknown): Buffer {
    return Buffer.from(JSON.stringify(content));
  }

  public static deserializeJson(contentData: Buffer): unknown {
    return JSON.parse(contentData.toString());
  }

  public readonly mockNodeRequire = jest.fn();

  public readonly mockSerializer = jest.fn(
    ({generatedContent}: SerializerArgs<unknown>) =>
      TestEnv.serializeJson(generatedContent)
  );

  public readonly mockDeserializer = jest.fn(
    ({readContentData}: DeserializerArgs) =>
      TestEnv.deserializeJson(readContentData)
  );

  public readonly readContent: string[];
  public readonly readContentData: Buffer;

  public readonly absoluteRootDirname: string;
  public readonly absoluteManifestFilename: string;
  public readonly absoluteFilename: string;
  public readonly absoluteDirname: string;

  public readonly loadedManifest: LoadedManifest;

  public readonly file: File<string[]>;
  public readonly fileWithDeserializer: File<string[]>;

  public constructor(filename: string = 'a') {
    this.readContent = ['bar'];
    this.readContentData = TestEnv.serializeJson(this.readContent);

    this.absoluteRootDirname = '/path/to';
    this.absoluteManifestFilename = path.join(this.absoluteRootDirname, 'm');
    this.absoluteFilename = path.join(this.absoluteRootDirname, filename);
    this.absoluteDirname = path.dirname(this.absoluteFilename);

    this.loadedManifest = {
      absoluteManifestFilename: this.absoluteManifestFilename
    };

    const filetype = {
      contentSchema: {type: 'array', items: {type: 'string'}},
      serializer: this.mockSerializer
    };

    this.file = {filename, filetype, initialContent: ['foo']};

    this.fileWithDeserializer = {
      ...this.file,
      filetype: {...filetype, deserializer: this.mockDeserializer as any}
    };
  }
}
