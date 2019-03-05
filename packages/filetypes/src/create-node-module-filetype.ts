import {Filetype} from '@rcgen/core';

export interface NodeModuleFiletypeOptions {
  readonly contentSchema?: object;
}

export function createNodeModuleFiletype<T = object>(
  options: NodeModuleFiletypeOptions = {}
): Filetype<T> {
  const {contentSchema = {type: 'object'}} = options;

  return {
    contentSchema,
    serializer: ({absoluteManifestFilename, filename}) =>
      Buffer.from(
        `// prettier-ignore\nmodule.exports = require('@rcgen/core').generateContent('${absoluteManifestFilename}', '${filename}');\n`
      )
  };
}
