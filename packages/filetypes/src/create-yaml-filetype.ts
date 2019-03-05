import {Filetype} from '@rcgen/core';
import YAML from 'yaml';

export interface YamlFiletypeOptions {
  readonly contentSchema?: object;
}

export function createYamlFiletype<T = object>(
  options: YamlFiletypeOptions = {}
): Filetype<T> {
  const {contentSchema = {type: 'object'}} = options;

  return {
    contentSchema,
    serializer: ({generatedContent}) =>
      Buffer.from(YAML.stringify(generatedContent)),
    deserializer: ({readContentData}) =>
      YAML.parse(readContentData.toString().trim())
  };
}
