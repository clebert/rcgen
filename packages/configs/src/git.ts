import {
  File,
  Globs,
  ManifestCreator,
  matchFile,
  mergeManifest
} from '@rcgen/core';
import {createTextLinesFiletype} from '@rcgen/filetypes';
import {merge} from '@rcgen/patchers';

export interface GitIgnoreOptions extends Globs {
  readonly additionalFilenames?: string[];
}

export const gitIgnoreFile: File<string[]> = {
  filename: '.gitignore',
  filetype: createTextLinesFiletype()
};

export const gitFiles = [gitIgnoreFile];

export function git(): ManifestCreator {
  return mergeManifest({files: gitFiles});
}

export function gitIgnore(options: GitIgnoreOptions = {}): ManifestCreator {
  const {additionalFilenames = []} = options;

  return mergeManifest({
    patchers: [
      merge(gitIgnoreFile.filename, ({otherFilenames}) =>
        [...otherFilenames, ...additionalFilenames].filter(matchFile(options))
      )
    ]
  });
}
