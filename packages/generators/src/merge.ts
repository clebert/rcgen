import {Generator} from '@rcgen/core';
import deepmerge from 'deepmerge';

export function merge<T extends object>(
  filename: string,
  generator: Generator<T>
): Generator<T> {
  return args => {
    const {filename: currentFilename, previouslyGeneratedContent} = args;

    if (currentFilename !== filename) {
      return previouslyGeneratedContent;
    }

    const newlyGeneratedContent = generator(args);

    if (!newlyGeneratedContent) {
      return previouslyGeneratedContent;
    }

    if (!previouslyGeneratedContent) {
      return newlyGeneratedContent;
    }

    return deepmerge<T>(previouslyGeneratedContent, newlyGeneratedContent);
  };
}
