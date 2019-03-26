import {Manifest} from './load-manifest';
import {ManifestCreator} from './manifest-creator';

function mergeArrays<T>(a?: T[], b?: T[]): T[] | undefined {
  return !a ? b : !b ? a : [...a, ...b];
}

export function mergeManifest(manifest: Manifest): ManifestCreator {
  return (initialManifest = {}) => ({
    files: mergeArrays(initialManifest.files, manifest.files),
    generators: mergeArrays(initialManifest.generators, manifest.generators)
  });
}
