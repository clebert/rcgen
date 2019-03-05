import {Patcher} from '@rcgen/core';
import deepmerge from 'deepmerge';

export function merge<T extends object>(
  filename: string,
  object: Partial<T>
): Patcher<T> {
  return ({filename: currentFilename, generatedContent}) =>
    currentFilename === filename
      ? deepmerge(generatedContent, object)
      : generatedContent;
}
