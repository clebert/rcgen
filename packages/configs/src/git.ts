import {
  File,
  Globs,
  ManifestCreator,
  matchFile,
  mergeManifest
} from '@rcgen/core';
import {createTextLinesFiletype} from '@rcgen/filetypes';
import {merge} from '@rcgen/patchers';

const gitignoreFile: File<readonly string[]> = {
  filename: '.gitignore',
  filetype: createTextLinesFiletype()
};

export function git(): ManifestCreator {
  return mergeManifest({files: [gitignoreFile]});
}

export function gitIgnoreFiles(...filenames: readonly string[]): ManifestCreator {
  return mergeManifest({
    patchers: [merge<readonly string[]>(gitignoreFile.filename, () => filenames)]
  });
}

export function gitIgnoreIntrinsicFiles(globs: Globs = {}): ManifestCreator {
  return mergeManifest({
    patchers: [
      merge<readonly string[]>(gitignoreFile.filename, ({otherFilenames}) =>
        otherFilenames.filter(matchFile(globs))
      )
    ]
  });
}
