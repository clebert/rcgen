import {loadFile} from './load-file';
import {loadManifest} from './load-manifest';
import {patchFile} from './patch-file';

function createContentCannotBeGeneratedError(
  filename: string,
  cause: string
): Error {
  return new Error(
    `The content of file '${filename}' cannot be generated ${cause}.`
  );
}

/**
 * @throws if none of the patchers matches the file
 */
export function generateContent(
  absoluteManifestFilename: string,
  filename: string,
  nodeRequire?: (moduleName: string) => unknown
): unknown {
  const loadedManifest = loadManifest(absoluteManifestFilename, nodeRequire);
  const loadedFile = loadFile(loadedManifest, filename);
  const patchedFile = patchFile(loadedManifest, loadedFile);

  if (!patchedFile) {
    throw createContentCannotBeGeneratedError(
      filename,
      'because none of the patchers matches the file'
    );
  }

  return patchedFile.generatedContent;
}
