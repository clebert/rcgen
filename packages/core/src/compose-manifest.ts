import {ManifestCreator} from './manifest-creator';

export function composeManifest(
  ...manifestCreators: ManifestCreator[]
): ManifestCreator {
  return (initialManifest = {}) =>
    manifestCreators.reduce(
      (manifest, manifestCreator) => manifestCreator(manifest),
      initialManifest
    );
}
