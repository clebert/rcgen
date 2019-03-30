import {Filetype} from '@rcgen/core';
import {ContentPreprocessor} from './content-preprocessor';

export interface TextFiletypeOptions {
  readonly contentPreprocessor?: ContentPreprocessor<string[]>;
}

export function createTextFiletype(
  options: TextFiletypeOptions = {}
): Filetype<string[]> {
  const {contentPreprocessor = (content: string[]) => content} = options;

  return {
    contentSchema: {type: 'array', items: {type: 'string'}},
    serializer: ({content}) =>
      Buffer.from(contentPreprocessor(content).join('\n')),
    deserializer: ({contentData}) => contentData.toString().split('\n')
  };
}
