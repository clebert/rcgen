import {File, ManifestCreator, mergeManifest} from '@rcgen/core';
import {createTextFiletype} from '@rcgen/filetypes';
import {replace} from '@rcgen/generators';
import {findManagedFiles} from './find-managed-files';
import {Project} from './project';

const nodeVersionFile: File<string[]> = {
  filename: '.node-version',
  filetype: createTextFiletype()
};

const nvmrcFile: File<string[]> = {
  filename: '.nvmrc',
  filetype: createTextFiletype()
};

export function nodeInit(project: Project): ManifestCreator {
  const {nodeVersion} = project;
  const files = findManagedFiles(project, [nodeVersionFile, nvmrcFile]);

  const generators = nodeVersion
    ? [
        replace(nodeVersionFile.filename, () => [nodeVersion, '']),
        replace(nvmrcFile.filename, () => [nodeVersion, ''])
      ]
    : [];

  return mergeManifest({files, generators});
}
