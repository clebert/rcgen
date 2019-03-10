import {Patcher} from '@rcgen/core';
import deepmerge from 'deepmerge';

export function merge<T extends object>(
  filename: string,
  patcher: Patcher<T>
): Patcher<T> {
  return args => {
    const {filename: currentFilename, generatedContent} = args;

    return currentFilename === filename
      ? deepmerge(generatedContent, patcher(args))
      : generatedContent;
  };
}
