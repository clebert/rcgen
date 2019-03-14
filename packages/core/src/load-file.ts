import {existsSync, readFileSync} from 'fs';
import path from 'path';
import {File} from './compose-manifest';
import {LoadedManifest} from './load-manifest';
import {matchFile} from './match-file';
import {validate} from './validate';

export interface LoadedFile<T> extends File<T> {
  readonly exisitingContentData?: Buffer;
  readonly exisitingContent?: T;
}

function createFileCannotBeLoadedError(
  filename: string,
  cause: string,
  details?: string
): Error {
  return new Error(
    `File '${filename}' cannot be loaded ${cause}.${
      details ? ` Details: ${details}` : ''
    }`
  );
}

/**
 * @throws if the file is undefined
 * @throws if the file could not be accessed
 * @throws if the exisiting content data of the file could not be read
 * @throws if the exisiting content of the file could not be deserialized
 * @throws if the exisiting content of the file is invalid
 */
export function loadFile<T = unknown>(
  loadedManifest: LoadedManifest,
  filename: string
): LoadedFile<T> | undefined {
  const {absoluteManifestFilename, files = []} = loadedManifest;

  const file = files.find(
    ({filename: otherFilename}) => filename === otherFilename
  );

  if (!file) {
    throw createFileCannotBeLoadedError(filename, 'because it is undefined');
  }

  if (!matchFile(loadedManifest)(filename)) {
    return;
  }

  const absoluteRootDirname = path.dirname(absoluteManifestFilename);
  const absoluteFilename = path.join(absoluteRootDirname, filename);

  try {
    if (!existsSync(absoluteFilename)) {
      return file;
    }
  } catch (error) {
    throw createFileCannotBeLoadedError(
      filename,
      'because it could not be accessed',
      error.message
    );
  }

  let exisitingContentData: Buffer;

  try {
    exisitingContentData = readFileSync(absoluteFilename);
  } catch (error) {
    throw createFileCannotBeLoadedError(
      filename,
      'because its exisiting content data could not be read',
      error.message
    );
  }

  const {
    filetype: {contentSchema, deserializer}
  } = file;

  if (!deserializer) {
    return {...file, exisitingContentData};
  }

  let exisitingContent: T;

  try {
    exisitingContent = deserializer({
      absoluteManifestFilename,
      filename,
      contentData: exisitingContentData
    });
  } catch (error) {
    throw createFileCannotBeLoadedError(
      filename,
      'because its exisiting content could not be deserialized',
      error.message
    );
  }

  const exisitingContentResult = validate<T>(
    exisitingContent,
    'exisitingContent',
    contentSchema
  );

  if (!exisitingContentResult.isValid(exisitingContent)) {
    throw createFileCannotBeLoadedError(
      filename,
      'because its exisiting content is invalid',
      exisitingContentResult.validationMessage
    );
  }

  return {...file, exisitingContentData, exisitingContent};
}
