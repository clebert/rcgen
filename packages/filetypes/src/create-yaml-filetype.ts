import {Filetype} from '@rcgen/core';
import YAML from 'yaml';
import {ContentPreprocessor} from './content-preprocessor';

export interface YamlFiletypeOptions<T> {
  readonly contentPreprocessor?: ContentPreprocessor<T>;
  readonly contentSchema?: object;
}

export function createYamlFiletype<T = object>(
  options: YamlFiletypeOptions<T> = {}
): Filetype<T> {
  const {
    contentPreprocessor = (content: T) => content,
    contentSchema = {type: 'object'}
  } = options;

  return {
    contentSchema,
    serializer: ({content}) =>
      Buffer.from(YAML.stringify(contentPreprocessor(content))),
    deserializer: ({contentData}) => YAML.parse(contentData.toString().trim())
  };
}
