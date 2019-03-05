import {Patcher} from '@rcgen/core';

export function addLines(filename: string, lines: string[]): Patcher<string[]> {
  return ({filename: currentFilename, generatedContent}) =>
    currentFilename === filename
      ? [...generatedContent, ...lines]
      : generatedContent;
}
