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
    serializer: ({content}) =>
      Buffer.from(`${JSON.stringify(content, null, 2)}\n`),
    deserializer: ({contentData}) => JSON.parse(contentData.toString().trim())
  };
}
