import {Manifest} from './load-manifest';
import {ManifestCreator} from './manifest-creator';

function mergeArrays<T>(a?: readonly T[], b?: readonly T[]): readonly T[] | undefined {
  return !a ? b : !b ? a : [...a, ...b];
}

export function mergeManifest(manifest: Manifest): ManifestCreator {
  return (initialManifest = {}) => ({
    files: mergeArrays(initialManifest.files, manifest.files),
    patchers: mergeArrays(initialManifest.patchers, manifest.patchers),
    include: mergeArrays(initialManifest.include, manifest.include),
    exclude: mergeArrays(initialManifest.exclude, manifest.exclude)
  });
}
