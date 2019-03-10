import {Enhancer} from './compose-enhancers';
import {Manifest} from './load-manifest';

function mergeArrays<T>(a?: T[], b?: T[]): T[] | undefined {
  return !a ? b : !b ? a : [...a, ...b];
}

export function enhanceManifest(manifest: Manifest): Enhancer<Manifest> {
  return currentManifest => ({
    files: mergeArrays(currentManifest.files, manifest.files),
    patchers: mergeArrays(currentManifest.patchers, manifest.patchers),
    includedFilenamePatterns: mergeArrays(
      currentManifest.includedFilenamePatterns,
      manifest.includedFilenamePatterns
    ),
    excludedFilenamePatterns: mergeArrays(
      currentManifest.excludedFilenamePatterns,
      manifest.excludedFilenamePatterns
    )
  });
}
