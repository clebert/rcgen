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

// tslint:disable-next-line: no-any
export interface File<T = any> {
  readonly filename: string;
  readonly filetype: Filetype<T>;
  readonly initialContent: T;
  readonly conflictingFilenames?: string[];
}

export interface PatcherArgs<T> {
  readonly absoluteManifestFilename: string;
  readonly filename: string;
  readonly generatedContent: T;
  readonly exisitingContent: T | undefined;
  readonly otherFilenames: string[];
}

// tslint:disable-next-line: no-any
export type Patcher<T = any> = (args: PatcherArgs<T>) => T;

export interface Manifest extends Globs {
  readonly files?: File[];
  readonly patchers?: Patcher[];
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
