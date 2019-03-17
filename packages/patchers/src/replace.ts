import {Patcher} from '@rcgen/core';

export function replace<T>(filename: string, patcher: Patcher<T>): Patcher<T> {
  return args => {
    const {filename: currentFilename, generatedContent} = args;

    if (currentFilename !== filename) {
      return generatedContent;
    }

    const newlyGeneratedContent = patcher(args);

    return newlyGeneratedContent !== undefined
      ? newlyGeneratedContent
      : generatedContent;
  };
}
