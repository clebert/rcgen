import {Patcher} from '@rcgen/core';
import deepmerge from 'deepmerge';

export function merge<T extends object>(
  filename: string,
  patcher: Patcher<T>
): Patcher<T> {
  return args => {
    const {filename: currentFilename, generatedContent} = args;

    if (currentFilename !== filename) {
      return generatedContent;
    }

    const newlyGeneratedContent = patcher(args);

    if (!newlyGeneratedContent) {
      return generatedContent;
    }

    if (!generatedContent) {
      return newlyGeneratedContent;
    }

    return deepmerge<T>(generatedContent, newlyGeneratedContent);
  };
}
