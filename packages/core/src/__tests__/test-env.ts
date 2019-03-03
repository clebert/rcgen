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
import {File, LoadedManifest} from '..';

export class TestEnv {
  // tslint:disable: no-any
  public static readonly mockExistsSync = (existsSync as any) as jest.Mock;
  public static readonly mockReadFileSync = (readFileSync as any) as jest.Mock;
  public static readonly mockWriteFileSync = (writeFileSync as any) as jest.Mock;
  public static readonly mockMkdirpSync = (mkdirp.sync as any) as jest.Mock;
  // tslint:enable: no-any

  public static serializeJson(content: unknown): Buffer {
    return Buffer.from(JSON.stringify(content));
  }

  public static deserializeJson(contentData: Buffer): unknown {
    return JSON.parse(contentData.toString());
  }

  public readonly mockNodeRequire = jest.fn();
  public readonly mockSerializer = jest.fn(TestEnv.serializeJson);
  public readonly mockDeserializer = jest.fn(TestEnv.deserializeJson);

  public readonly readContent: string[];
  public readonly readContentData: Buffer;

  public readonly absoluteRootDirname: string;
  public readonly absoluteFilename: string;
  public readonly absoluteDirname: string;

  public readonly loadedManifest: LoadedManifest;

  public readonly file: File<string[]>;
  public readonly fileWithDeserializer: File<string[]>;

  public constructor(filename: string = 'a') {
    this.readContent = ['bar'];
    this.readContentData = TestEnv.serializeJson(this.readContent);

    this.absoluteRootDirname = '/path/to';
    this.absoluteFilename = path.join(this.absoluteRootDirname, filename);
    this.absoluteDirname = path.dirname(this.absoluteFilename);

    this.loadedManifest = {
      absoluteManifestFilename: path.join(this.absoluteRootDirname, 'm'),
      files: []
    };

    const filetype = {
      contentSchema: {type: 'array', items: {type: 'string'}},
      serializer: this.mockSerializer
    };

    this.file = {filename, filetype, initialContent: ['foo']};

    this.fileWithDeserializer = {
      ...this.file,
      // tslint:disable-next-line: no-any
      filetype: {...filetype, deserializer: this.mockDeserializer as any}
    };
  }
}
