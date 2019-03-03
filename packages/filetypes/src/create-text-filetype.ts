import {Filetype} from '@rcgen/core';

export interface TextFiletypeOptions {
  readonly insertFinalNewline?: boolean;
  readonly newlineCharacter?: string;
}

export function createTextFiletype(
  options: TextFiletypeOptions = {}
): Filetype<string[]> {
  const {insertFinalNewline, newlineCharacter = '\n'} = options;

  return {
    contentSchema: {type: 'array', items: {type: 'string'}},
    serializer: content => {
      const text = content.join(newlineCharacter);

      return Buffer.from(
        !insertFinalNewline || text.endsWith(newlineCharacter)
          ? text
          : `${text}${newlineCharacter}`
      );
    },
    deserializer: contentData => contentData.toString().split(newlineCharacter)
  };
}
