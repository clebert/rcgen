import {Filetype} from '@rcgen/core';
import {ContentPreprocessor} from './content-preprocessor';

export interface JsonFiletypeOptions<T> {
  readonly contentPreprocessor?: ContentPreprocessor<T>;
  readonly contentSchema?: object;
}

export function createJsonFiletype<T = object>(
  options: JsonFiletypeOptions<T> = {}
): Filetype<T> {
  const {
    contentPreprocessor = (content: T) => content,
    contentSchema = {type: 'object'}
  } = options;

  return {
    contentSchema,
    serializer: ({content}) =>
      Buffer.from(`${JSON.stringify(contentPreprocessor(content), null, 2)}\n`),
    deserializer: ({contentData}) => JSON.parse(contentData.toString().trim())
  };
}
