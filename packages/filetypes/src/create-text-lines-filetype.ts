import {Filetype} from '@rcgen/core';
import {ContentPreprocessor} from './content-preprocessor';

export interface TextLinesFiletypeOptions {
  readonly contentPreprocessor?: ContentPreprocessor<readonly string[]>;
}

function preprocessTextLines(textLines: readonly string[]): readonly string[] {
  const preprocessedTextLines = Array.from(
    new Set(
      textLines
        .map(textLine => textLine.trim())
        .filter(textLine => Boolean(textLine))
    ).values()
  ).sort();

  return preprocessedTextLines.length ? [...preprocessedTextLines, ''] : [];
}

export function createTextLinesFiletype(
  options: TextLinesFiletypeOptions = {}
): Filetype<readonly string[]> {
  const {contentPreprocessor = preprocessTextLines} = options;

  return {
    contentSchema: {type: 'array', items: {type: 'string'}},
    serializer: ({content}) =>
      Buffer.from(contentPreprocessor(content).join('\n')),
    deserializer: ({contentData}) => contentData.toString().split('\n')
  };
}
