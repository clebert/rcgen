import {File, ManifestCreator, mergeManifest} from '@rcgen/core';
import {createTextLinesFiletype} from '@rcgen/filetypes';
import {replace} from '@rcgen/patchers';

const nodeVersionFile: File<readonly string[]> = {
  filename: '.node-version',
  filetype: createTextLinesFiletype()
};

const nvmrcFile: File<readonly string[]> = {
  filename: '.nvmrc',
  filetype: createTextLinesFiletype()
};

export function node(version: string): ManifestCreator {
  return mergeManifest({
    files: [nodeVersionFile, nvmrcFile],
    patchers: [
      replace(nodeVersionFile.filename, () => [version]),
      replace(nvmrcFile.filename, () => [version])
    ]
  });
}
