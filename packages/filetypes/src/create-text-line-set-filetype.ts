import {Filetype} from '@rcgen/core';
import {TextLineSet} from './text-line-set';

export function createTextLineSetFiletype(): Filetype<TextLineSet> {
  return {
    contentSchema: {type: 'array', items: {type: 'string'}},
    serializer: ({content: textLineSet}) => {
      const text = textLineSet.getTextLines().join('\n');

      return Buffer.from(text ? `${text}\n` : '');
    },
    deserializer: ({contentData}) => {
      const textLineSet = new TextLineSet();

      for (const textLine of contentData.toString().split('\n')) {
        textLineSet.addTextLine(textLine);
      }

      return textLineSet;
    }
  };
}
