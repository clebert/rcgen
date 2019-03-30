import {File} from '@rcgen/core';
import {Project} from './project';

export function findManagedFiles(
  project: Project,
  // tslint:disable-next-line: no-any
  files: File<any>[]
): File<unknown>[] {
  const {managedGeneratedFiles = []} = project;

  return files.filter(({filename}) =>
    managedGeneratedFiles.find(
      managedGeneratedFile => managedGeneratedFile.filename === filename
    )
  );
}
