import {Filetype} from '@rcgen/core';
import {ContentPreprocessor} from './content-preprocessor';

export interface TextLinesFiletypeOptions {
  readonly contentPreprocessor?: ContentPreprocessor<string[]>;
}

function preprocessTextLines(textLines: string[]): string[] {
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
): Filetype<string[]> {
  const {contentPreprocessor = preprocessTextLines} = options;

  return {
    contentSchema: {type: 'array', items: {type: 'string'}},
    serializer: ({content}) =>
      Buffer.from(contentPreprocessor(content).join('\n')),
    deserializer: ({contentData}) => contentData.toString().split('\n')
  };
}
