import {Manifest} from './load-manifest';

export type ManifestCreator = (initialManifest?: Manifest) => Manifest;
