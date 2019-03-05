import {Filetype} from '@rcgen/core';

export interface JsonFiletypeOptions {
  readonly contentSchema?: object;
}

export function createJsonFiletype<T = object>(
  options: JsonFiletypeOptions = {}
): Filetype<T> {
  const {contentSchema = {type: 'object'}} = options;

  return {
    contentSchema,
    serializer: ({generatedContent}) =>
      Buffer.from(`${JSON.stringify(generatedContent, null, 2)}\n`),
    deserializer: ({readContentData}) =>
      JSON.parse(readContentData.toString().trim())
  };
}
