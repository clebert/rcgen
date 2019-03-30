import {File, ManifestCreator, mergeManifest} from '@rcgen/core';
import {createTextFiletype} from '@rcgen/filetypes';
import {merge} from '@rcgen/generators';
import {findManagedFiles} from './find-managed-files';
import {Project} from './project';

const gitignoreFile: File<string[]> = {
  filename: '.gitignore',
  filetype: createTextFiletype({
    contentPreprocessor: textLines => [...textLines.sort(), '']
  })
};

export function gitInit(project: Project): ManifestCreator {
  const {
    managedGeneratedFiles = [],
    unmanagedGeneratedFiles = [],
    nonGeneratedUnversionedFiles = []
  } = project;

  const files = findManagedFiles(project, [gitignoreFile]);

  const generators = [
    merge(gitignoreFile.filename, () => [
      ...managedGeneratedFiles
        .filter(({versioned}) => !versioned)
        .map(({filename}) => filename),
      ...unmanagedGeneratedFiles
        .filter(({versioned}) => !versioned)
        .map(({pattern}) => pattern),
      ...nonGeneratedUnversionedFiles.map(({pattern}) => pattern)
    ])
  ];

  return mergeManifest({files, generators});
}
