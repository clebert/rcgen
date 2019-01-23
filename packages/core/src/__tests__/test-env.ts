jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn()
}));

import {existsSync, readFileSync, writeFileSync} from 'fs';
import {File, LoadedManifest} from '..';

export class TestEnv {
  // tslint:disable: no-any
  public readonly mockExistsSync = (existsSync as any) as jest.Mock;
  public readonly mockReadFileSync = (readFileSync as any) as jest.Mock;
  public readonly mockWriteFileSync = (writeFileSync as any) as jest.Mock;
  // tslint:enable: no-any
  public readonly mockNodeRequire: jest.Mock;
  public readonly mockSerializer: jest.Mock;
  public readonly mockDeserializer: jest.Mock;
  public readonly readContent: string[];
  public readonly readContentData: Buffer;
  public readonly rootDirname: string;
  public readonly loadedManifest: LoadedManifest;
  public readonly absoluteFilename: string;
  public readonly file: File<string[]>;
  public readonly fileWithDeserializer: File<string[]>;

  public constructor() {
    this.mockExistsSync.mockReset();
    this.mockReadFileSync.mockReset();
    this.mockWriteFileSync.mockReset();

    this.mockNodeRequire = jest.fn();
    this.mockSerializer = jest.fn(this.serializeJson);
    this.mockDeserializer = jest.fn(this.deserializeJson);
    this.readContent = ['bar'];
    this.readContentData = this.serializeJson(this.readContent);
    this.rootDirname = '/path/to';

    this.loadedManifest = {
      manifestFilename: `${this.rootDirname}/m`,
      files: []
    };

    const filename = 'a';

    this.absoluteFilename = `${this.rootDirname}/${filename}`;

    const filetype = {
      contentSchema: {type: 'array', items: {type: 'string'}},
      serializer: this.mockSerializer
    };

    this.file = {filename, filetype, initialContent: ['foo']};

    this.fileWithDeserializer = {
      ...this.file,
      filetype: {...filetype, deserializer: this.mockDeserializer}
    };
  }

  public serializeJson(content: unknown): Buffer {
    return Buffer.from(JSON.stringify(content));
  }

  public deserializeJson(contentData: Buffer): unknown {
    return JSON.parse(contentData.toString());
  }
}
