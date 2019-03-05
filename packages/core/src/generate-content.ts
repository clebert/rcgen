import {loadFile} from './load-file';
import {loadManifest} from './load-manifest';
import {patchFile} from './patch-file';

/**
 * @throws if the file is not included
 */
export function generateContent(
  absoluteManifestFilename: string,
  filename: string,
  nodeRequire?: (moduleName: string) => unknown
): unknown {
  const loadedManifest = loadManifest(absoluteManifestFilename, nodeRequire);
  const loadedFile = loadFile(loadedManifest, filename);

  if (!loadedFile) {
    throw new Error(
      `The content of file '${filename}' cannot be generated because the file is not included.`
    );
  }

  return patchFile(loadedManifest, loadedFile).generatedContent;
}
