import {Filetype} from '@rcgen/core';

export interface LinesFiletypeOptions {
  readonly newline?: string;
}

function normalize(lines: string[]): string[] {
  return Array.from(
    new Set(
      lines.map(line => line.trim()).filter(line => Boolean(line))
    ).values()
  ).sort();
}

export function createLinesFiletype(
  options: LinesFiletypeOptions = {}
): Filetype<string[]> {
  const {newline = '\n'} = options;

  return {
    contentSchema: {type: 'array', items: {type: 'string'}},
    serializer: ({generatedContent}) =>
      Buffer.from(`${normalize(generatedContent).join(newline)}${newline}`),
    deserializer: ({readContentData}) =>
      normalize(readContentData.toString().split(newline))
  };
}
