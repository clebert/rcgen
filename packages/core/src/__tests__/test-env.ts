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

// tslint:disable: no-any
export const mockExistsSync = (existsSync as any) as jest.Mock;
export const mockReadFileSync = (readFileSync as any) as jest.Mock;
export const mockWriteFileSync = (writeFileSync as any) as jest.Mock;
export const mockMkdirpSync = (mkdirp.sync as any) as jest.Mock;
// tslint:enable: no-any

export const mockSerializer = jest.fn();
export const mockDeserializer = jest.fn();
export const mockNodeRequire = jest.fn();

export const filetype = {
  contentSchema: {type: 'string'},
  serializer: mockSerializer
};

export const filetypeWithDeserializer = {
  contentSchema: {type: 'string'},
  serializer: mockSerializer,
  deserializer: mockDeserializer
};

export function serializeJson(content: unknown): Buffer {
  return Buffer.from(JSON.stringify(content));
}

export function deserializeJson(contentData: Buffer): unknown {
  return JSON.parse(contentData.toString());
}

beforeEach(() => {
  mockSerializer.mockImplementation(({content}) => serializeJson(content));

  mockDeserializer.mockImplementation(({contentData}) =>
    deserializeJson(contentData)
  );
});
