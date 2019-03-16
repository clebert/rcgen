import {Globs} from './match-file';

export interface SerializerArgs<T> {
  readonly absoluteManifestFilename: string;
  readonly filename: string;
  readonly content: T;
}

export type Serializer<T> = (args: SerializerArgs<T>) => Buffer;

export interface DeserializerArgs {
  readonly absoluteManifestFilename: string;
  readonly filename: string;
  readonly contentData: Buffer;
}

export type Deserializer<T> = (args: DeserializerArgs) => T;

export interface Filetype<T> {
  readonly contentSchema: object;
  readonly serializer: Serializer<T>;
  readonly deserializer?: Deserializer<T>;
}

export interface File<T> {
  readonly filename: string;
  readonly filetype: Filetype<T>;
  readonly conflictingFilenames?: string[];
}

export interface PatcherArgs<T> {
  readonly absoluteManifestFilename: string;
  readonly filename: string;
  readonly generatedContent: T | undefined;
  readonly existingContent: T | undefined;
  readonly otherFilenames: string[];
}

export type Patcher<T> = (args: PatcherArgs<T>) => T | undefined;

export interface Manifest extends Globs {
  // tslint:disable-next-line: no-any
  readonly files?: File<any>[];
  // tslint:disable-next-line: no-any
  readonly patchers?: Patcher<any>[];
}

export type ManifestCreator = (initialManifest?: Manifest) => Manifest;

export function composeManifest(
  ...manifestCreators: ManifestCreator[]
): ManifestCreator {
  return (initialManifest = {}) =>
    manifestCreators.reduce(
      (manifest, manifestCreator) => manifestCreator(manifest),
      initialManifest
    );
}
