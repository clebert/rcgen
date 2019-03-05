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
 * @throws if the generated content of the file will become invalid
 */
export function patchFile<T = unknown>(
  loadedManifest: LoadedManifest,
  loadedFile: LoadedFile<T>
): PatchedFile<T> {
  const {absoluteManifestFilename, patchers} = loadedManifest;

  const {
    filename,
    filetype: {contentSchema},
    initialContent,
    readContent
  } = loadedFile;

  let generatedContent = initialContent;

  if (!patchers) {
    return {...loadedFile, generatedContent};
  }

  for (const patcher of patchers) {
    try {
      generatedContent = patcher({
        absoluteManifestFilename,
        filename,
        generatedContent,
        readContent
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
        'because its generated content will become invalid',
        generatedContentResult.validationMessage
      );
    }
  }

  return {...loadedFile, generatedContent};
}
