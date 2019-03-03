import {Filetype} from '@rcgen/core';

export interface TextFiletypeOptions {
  readonly newlineCharacter?: string;
}

export function createTextFiletype(
  options: TextFiletypeOptions = {}
): Filetype<string[]> {
  const {newlineCharacter = '\n'} = options;

  return {
    contentSchema: {type: 'array', items: {type: 'string'}},
    serializer: content => {
      const text = content.join(newlineCharacter);

      return Buffer.from(
        text.endsWith(newlineCharacter) ? text : `${text}${newlineCharacter}`
      );
    },
    deserializer: contentData => contentData.toString().split(newlineCharacter)
  };
}
