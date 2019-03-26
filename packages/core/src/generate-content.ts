import {generateFile} from './generate-file';
import {loadFile} from './load-file';
import {loadManifest} from './load-manifest';

function createContentCannotBeGeneratedError(
  filename: string,
  cause: string
): Error {
  return new Error(
    `The content of file '${filename}' cannot be generated ${cause}.`
  );
}

/**
 * @throws if none of the generators matches the file
 */
export function generateContent(
  absoluteManifestFilename: string,
  filename: string,
  nodeRequire?: (moduleName: string) => unknown
): unknown {
  const loadedManifest = loadManifest(absoluteManifestFilename, nodeRequire);
  const loadedFile = loadFile(loadedManifest, filename);
  const generatedFile = generateFile(loadedManifest, loadedFile);

  if (!generatedFile) {
    throw createContentCannotBeGeneratedError(
      filename,
      'because none of the generators matches the file'
    );
  }

  return generatedFile.generatedContent;
}
