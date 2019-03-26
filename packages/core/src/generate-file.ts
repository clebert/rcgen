import {LoadedFile} from './load-file';
import {LoadedManifest} from './load-manifest';
import {validate} from './validate';

export interface GeneratedFile<T> extends LoadedFile<T> {
  readonly generatedContent: T;
}

function createFileCannotBeGeneratedError(
  filename: string,
  cause: string,
  details: string
): Error {
  return new Error(
    `File '${filename}' cannot be generated ${cause}. Details: ${details}`
  );
}

/**
 * @throws if a generator caused an error
 * @throws if a generator generates invalid content
 */
export function generateFile<T = unknown>(
  loadedManifest: LoadedManifest,
  loadedFile: LoadedFile<T>
): GeneratedFile<T> | null {
  const {absoluteManifestFilename, generators = []} = loadedManifest;
  const {filename, filetype, existingContent} = loadedFile;

  let generatedContent: T | undefined;

  for (const generator of generators) {
    let newlyGeneratedContent: T | undefined;

    try {
      newlyGeneratedContent = generator({
        absoluteManifestFilename,
        filename,
        previouslyGeneratedContent: generatedContent,
        existingContent
      });
    } catch (error) {
      throw createFileCannotBeGeneratedError(
        filename,
        'because a generator caused an error',
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
      throw createFileCannotBeGeneratedError(
        filename,
        'because a generator generates invalid content',
        generatedContentResult.validationMessage
      );
    }
  }

  return generatedContent !== undefined
    ? {...loadedFile, generatedContent}
    : null;
}
