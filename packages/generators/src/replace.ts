import {Generator} from '@rcgen/core';

export function replace<T>(
  filename: string,
  generator: Generator<T>
): Generator<T> {
  return args => {
    const {filename: currentFilename, previouslyGeneratedContent} = args;

    if (currentFilename !== filename) {
      return previouslyGeneratedContent;
    }

    const newlyGeneratedContent = generator(args);

    return newlyGeneratedContent !== undefined
      ? newlyGeneratedContent
      : previouslyGeneratedContent;
  };
}
