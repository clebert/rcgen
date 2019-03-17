import {Patcher} from '@rcgen/core';

export function replace<T>(filename: string, patcher: Patcher<T>): Patcher<T> {
  return args => {
    const {filename: currentFilename, generatedContent} = args;

    if (currentFilename !== filename) {
      return generatedContent;
    }

    return patcher(args) || generatedContent;
  };
}
