import {Patcher} from '@rcgen/core';

export function replace<T>(filename: string, value: T): Patcher<T> {
  return ({filename: currentFilename, generatedContent}) =>
    currentFilename === filename ? value : generatedContent;
}
