import {existsSync, writeFileSync} from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import {LoadedManifest} from './load-manifest';
import {PatchedFile} from './patch-file';

function createFileCannotBeSavedError(
  filename: string,
  cause: string,
  details?: string
): Error {
  return new Error(
    `File '${filename}' cannot be saved ${cause}.${
      details ? ` Details: ${details}` : ''
    }`
  );
}

/**
 * @throws if the file conflicts with an existing file
 * @throws if the generated content of the file could not be serialized
 * @throws if the generated content of the file differs from the read content of the file (not in force mode)
 * @throws if the required subdirectories of the file could not be created
 * @throws if the generated content of the file could not be written
 */
export function saveFile<T = unknown>(
  loadedManifest: LoadedManifest,
  patchedFile: PatchedFile<T>,
  force: boolean = false
): boolean {
  const {absoluteManifestFilename} = loadedManifest;

  const {
    filename,
    filetype: {serializer},
    conflictingFilenames,
    readContentData,
    generatedContent
  } = patchedFile;

  const absoluteRootDirname = path.dirname(absoluteManifestFilename);

  if (conflictingFilenames) {
    for (const conflictingFilename of conflictingFilenames) {
      if (existsSync(path.join(absoluteRootDirname, conflictingFilename))) {
        throw createFileCannotBeSavedError(
          filename,
          `because it conflicts with the existing file '${conflictingFilename}'`
        );
      }
    }
  }

  let generatedContentData: Buffer;

  try {
    generatedContentData = serializer({
      absoluteManifestFilename,
      filename,
      generatedContent
    });
  } catch (error) {
    throw createFileCannotBeSavedError(
      filename,
      'because its generated content could not be serialized',
      error.message
    );
  }

  if (readContentData) {
    if (generatedContentData.compare(readContentData) === 0) {
      return false;
    }

    if (!force) {
      throw createFileCannotBeSavedError(
        filename,
        'because its generated content differs from its read content'
      );
    }
  }

  const absoluteFilename = path.join(absoluteRootDirname, filename);

  try {
    mkdirp.sync(path.dirname(absoluteFilename));
  } catch (error) {
    throw createFileCannotBeSavedError(
      filename,
      'because its required subdirectories could not be created',
      error.message
    );
  }

  try {
    writeFileSync(absoluteFilename, generatedContentData);
  } catch (error) {
    throw createFileCannotBeSavedError(
      filename,
      'because its generated content could not be written',
      error.message
    );
  }

  return true;
}
