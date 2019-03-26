import {GeneratorArgs} from '@rcgen/core';

export function createGeneratorArgs<T>(
  filename: string,
  previouslyGeneratedContent?: T
): GeneratorArgs<T> {
  return {
    absoluteManifestFilename: '/path/to/m',
    filename,
    previouslyGeneratedContent,
    existingContent: undefined
  };
}
