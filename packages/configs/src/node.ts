import {File, ManifestCreator, mergeManifest} from '@rcgen/core';
import {createTextLinesFiletype} from '@rcgen/filetypes';
import {replace} from '@rcgen/patchers';

const nodeVersionFile: File<string[]> = {
  filename: '.node-version',
  filetype: createTextLinesFiletype()
};

const nvmrcFile: File<string[]> = {
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
