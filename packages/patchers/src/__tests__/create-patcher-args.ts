import {PatcherArgs} from '@rcgen/core';

export function createPatcherArgs<T>(
  filename: string,
  generatedContent: T
): PatcherArgs<T> {
  return {
    absoluteManifestFilename: '/path/to/m',
    filename,
    generatedContent,
    readContent: undefined,
    otherFilenames: []
  };
}
