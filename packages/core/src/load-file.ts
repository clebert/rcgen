import {existsSync, readFileSync} from 'fs';
import micromatch from 'micromatch';
import path from 'path';
import {File, LoadedManifest} from './load-manifest';
import {validate} from './validate';

export interface LoadedFile<T> extends File<T> {
  readonly readContentData?: Buffer;
  readonly readContent?: T;
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

function isMatch(filename: string, pattern: string): boolean {
  return micromatch.isMatch(filename, pattern, {dot: true, nonegate: true});
}

function isIncluded(
  filename: string,
  includedFilenames: string[] | undefined,
  excludedFilenames: string[] | undefined
): boolean {
  if (includedFilenames) {
    if (!includedFilenames.some(pattern => isMatch(filename, pattern))) {
      return false;
    }
  }

  if (excludedFilenames) {
    if (excludedFilenames.some(pattern => isMatch(filename, pattern))) {
      return false;
    }
  }

  return true;
}

/**
 * @throws if the file is undefined
 * @throws if the file could not be accessed
 * @throws if the content of the file could not be read
 * @throws if the read content of the file could not be deserialized
 * @throws if the read content of the file is invalid
 */
export function loadFile<T = unknown>(
  loadedManifest: LoadedManifest,
  filename: string
): LoadedFile<T> | undefined {
  const {
    absoluteManifestFilename,
    files,
    includedFilenames,
    excludedFilenames
  } = loadedManifest;

  const file = files.find(
    ({filename: otherFilename}) => filename === otherFilename
  );

  if (!file) {
    throw createFileCannotBeLoadedError(filename, 'because it is undefined');
  }

  if (!isIncluded(filename, includedFilenames, excludedFilenames)) {
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

  let readContentData: Buffer;

  try {
    readContentData = readFileSync(absoluteFilename);
  } catch (error) {
    throw createFileCannotBeLoadedError(
      filename,
      'because its content could not be read',
      error.message
    );
  }

  const {
    filetype: {contentSchema, deserializer}
  } = file;

  if (!deserializer) {
    return {...file, readContentData};
  }

  let readContent: T;

  try {
    readContent = deserializer({
      absoluteManifestFilename,
      filename,
      readContentData
    });
  } catch (error) {
    throw createFileCannotBeLoadedError(
      filename,
      'because its read content could not be deserialized',
      error.message
    );
  }

  const readContentResult = validate<T>(
    readContent,
    'readContent',
    contentSchema
  );

  if (!readContentResult.isValid(readContent)) {
    throw createFileCannotBeLoadedError(
      filename,
      'because its read content is invalid',
      readContentResult.validationMessage
    );
  }

  return {...file, readContentData, readContent};
}
