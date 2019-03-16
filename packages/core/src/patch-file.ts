import {LoadedFile} from './load-file';
import {LoadedManifest} from './load-manifest';
import {validate} from './validate';

export interface PatchedFile<T> extends LoadedFile<T> {
  readonly generatedContent: T;
}

function createFileCannotBePatchedError(
  filename: string,
  cause: string,
  details: string
): Error {
  return new Error(
    `File '${filename}' cannot be patched ${cause}. Details: ${details}`
  );
}

/**
 * @throws if a patcher caused an error
 * @throws if a patcher generates invalid content
 */
export function patchFile<T = unknown>(
  loadedManifest: LoadedManifest,
  loadedFile: LoadedFile<T>
): PatchedFile<T> | null {
  const {absoluteManifestFilename, files = [], patchers = []} = loadedManifest;
  const {filename, filetype, existingContent} = loadedFile;
  const otherFiles = files.filter(file => file.filename !== filename);
  const otherFilenames = otherFiles.map(otherFile => otherFile.filename);

  let generatedContent: T | undefined;

  for (const patcher of patchers) {
    let newlyGeneratedContent: T | undefined;

    try {
      newlyGeneratedContent = patcher({
        absoluteManifestFilename,
        filename,
        generatedContent,
        existingContent,
        otherFilenames
      });
    } catch (error) {
      throw createFileCannotBePatchedError(
        filename,
        'because a patcher caused an error',
        error.message
      );
    }

    if (newlyGeneratedContent === undefined) {
      continue;
    }

    generatedContent = newlyGeneratedContent;

    const generatedContentResult = validate<T>(
      generatedContent,
      'generatedContent',
      filetype.contentSchema
    );

    if (!generatedContentResult.isValid(generatedContent)) {
      throw createFileCannotBePatchedError(
        filename,
        'because a patcher generates invalid content',
        generatedContentResult.validationMessage
      );
    }
  }

  return generatedContent !== undefined
    ? {...loadedFile, generatedContent}
    : null;
}
