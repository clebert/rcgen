import {existsSync, readFileSync} from 'fs';
import path from 'path';
import {File, LoadedManifest} from './load-manifest';
import {validate} from './validate';

export interface LoadedFile<T> extends File<T> {
  readonly existingContentData?: Buffer;
  readonly existingContent?: T;
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
 * @throws if the existing content data of the file could not be read
 * @throws if the existing content of the file could not be deserialized
 * @throws if the existing content of the file is invalid
 */
export function loadFile<T = unknown>(
  loadedManifest: LoadedManifest,
  filename: string
): LoadedFile<T> {
  const {absoluteManifestFilename, files = []} = loadedManifest;

  const file = files.find(
    ({filename: otherFilename}) => filename === otherFilename
  );

  if (!file) {
    throw createFileCannotBeLoadedError(filename, 'because it is undefined');
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

  let existingContentData: Buffer;

  try {
    existingContentData = readFileSync(absoluteFilename);
  } catch (error) {
    throw createFileCannotBeLoadedError(
      filename,
      'because its existing content data could not be read',
      error.message
    );
  }

  const {
    filetype: {contentSchema, deserializer}
  } = file;

  if (!deserializer) {
    return {...file, existingContentData};
  }

  let existingContent: T;

  try {
    existingContent = deserializer({
      absoluteManifestFilename,
      filename,
      contentData: existingContentData
    });
  } catch (error) {
    throw createFileCannotBeLoadedError(
      filename,
      'because its existing content could not be deserialized',
      error.message
    );
  }

  const existingContentResult = validate<T>(
    existingContent,
    'existingContent',
    contentSchema
  );

  if (!existingContentResult.isValid(existingContent)) {
    throw createFileCannotBeLoadedError(
      filename,
      'because its existing content is invalid',
      existingContentResult.validationMessage
    );
  }

  return {...file, existingContentData, existingContent};
}
