import {File, ManifestCreator, mergeManifest} from '@rcgen/core';
import {createJsonFiletype} from '@rcgen/filetypes';
import {merge} from '@rcgen/patchers';
import sortPackageJson from 'sort-package-json';

const packageJsonFile: File<object> = {
  filename: 'package.json',
  filetype: createJsonFiletype({contentPreprocessor: sortPackageJson})
};

export function npm(): ManifestCreator {
  return mergeManifest({
    files: [packageJsonFile],
    patchers: [
      merge<object>(
        packageJsonFile.filename,
        ({existingContent}) => existingContent
      )
    ]
  });
}
