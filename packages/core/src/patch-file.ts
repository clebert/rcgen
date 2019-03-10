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
 * @throws if the newly generated content of the file is invalid
 */
export function patchFile<T = unknown>(
  loadedManifest: LoadedManifest,
  loadedFile: LoadedFile<T>
): PatchedFile<T> {
  const {absoluteManifestFilename, files = [], patchers = []} = loadedManifest;

  const {
    filename,
    filetype: {contentSchema},
    initialContent,
    exisitingContent
  } = loadedFile;

  const otherFilenames = files
    .filter(file => file.filename !== filename)
    .map(file => file.filename);

  let generatedContent = initialContent;

  for (const patcher of patchers) {
    try {
      generatedContent = patcher({
        absoluteManifestFilename,
        filename,
        generatedContent,
        exisitingContent,
        otherFilenames
      });
    } catch (error) {
      throw createFileCannotBePatchedError(
        filename,
        'because a patcher caused an error',
        error.message
      );
    }

    const generatedContentResult = validate<T>(
      generatedContent,
      'generatedContent',
      contentSchema
    );

    if (!generatedContentResult.isValid(generatedContent)) {
      throw createFileCannotBePatchedError(
        filename,
        'because its newly generated content is invalid',
        generatedContentResult.validationMessage
      );
    }
  }

  return {...loadedFile, generatedContent};
}
