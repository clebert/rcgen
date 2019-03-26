import path from 'path';
import {validate} from './validate';

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
}

export type Patcher<T> = (args: PatcherArgs<T>) => T | undefined;

export interface Manifest {
  // tslint:disable-next-line: no-any
  readonly files?: File<any>[];
  // tslint:disable-next-line: no-any
  readonly patchers?: Patcher<any>[];
}

export interface LoadedManifest extends Manifest {
  readonly absoluteManifestFilename: string;
}

function createManifestCannotBeLoadedError(
  absoluteManifestFilename: string,
  cause: string,
  details?: string
): Error {
  return new Error(
    `Manifest '${absoluteManifestFilename}' cannot be loaded ${cause}.${
      details ? ` Details: ${details}` : ''
    }`
  );
}

const serializerSchema = {isFunction: true};
const deserializerSchema = {isFunction: true};

const filetypeSchema = {
  type: 'object',
  properties: {
    contentSchema: {type: 'object'},
    serializer: serializerSchema,
    deserializer: deserializerSchema
  },
  required: ['contentSchema', 'serializer'],
  additionalProperties: false
};

const fileSchema = {
  type: 'object',
  properties: {
    filename: {type: 'string'},
    filetype: filetypeSchema,
    conflictingFilenames: {type: 'array', items: {type: 'string'}}
  },
  required: ['filename', 'filetype'],
  additionalProperties: false
};

const patcherSchema = {isFunction: true};

const manifestSchema = {
  type: 'object',
  properties: {
    files: {type: 'array', items: fileSchema},
    patchers: {type: 'array', items: patcherSchema}
  },
  additionalProperties: false
};

const manifestModuleSchema = {
  type: 'object',
  properties: {default: manifestSchema},
  required: ['default'],
  additionalProperties: false
};

/**
 * @throws if the filename of the manifest is not absolute
 * @throws if the module of the manifest could not be required
 * @throws if the module of the manifest does not have a valid default export
 * @throws if at least two of the files in the manifest have the same filename
 * @throws if the filename of a file in the manifest is not relative
 * @throws if a file in the manifest conflicts with itself
 * @throws if a file in the manifest conflicts with another file in the manifest
 */
export function loadManifest(
  absoluteManifestFilename: string,
  nodeRequire: (moduleName: string) => unknown = require
): LoadedManifest {
  if (!path.isAbsolute(absoluteManifestFilename)) {
    throw createManifestCannotBeLoadedError(
      absoluteManifestFilename,
      'because its filename is not absolute'
    );
  }

  let manifestModule: unknown;

  try {
    manifestModule = nodeRequire(absoluteManifestFilename);
  } catch (error) {
    throw createManifestCannotBeLoadedError(
      absoluteManifestFilename,
      'because its module could not be required',
      error.message
    );
  }

  const manifestModuleResult = validate<{readonly default: Manifest}>(
    manifestModule,
    'manifestModule',
    manifestModuleSchema
  );

  if (!manifestModuleResult.isValid(manifestModule)) {
    throw createManifestCannotBeLoadedError(
      absoluteManifestFilename,
      'because its module does not have a valid default export',
      manifestModuleResult.validationMessage
    );
  }

  const manifest = manifestModule.default;
  const {files = []} = manifest;
  const filenames = new Set<string>();

  for (const {filename} of files) {
    if (filenames.has(filename)) {
      throw createManifestCannotBeLoadedError(
        absoluteManifestFilename,
        `because at least two of its files have the same filename '${filename}'`
      );
    }

    filenames.add(filename);

    if (path.isAbsolute(filename)) {
      throw createManifestCannotBeLoadedError(
        absoluteManifestFilename,
        `because the filename of its file '${filename}' is not relative`
      );
    }

    for (const {filename: otherFilename, conflictingFilenames} of files) {
      if (conflictingFilenames && conflictingFilenames.includes(filename)) {
        if (filename === otherFilename) {
          throw createManifestCannotBeLoadedError(
            absoluteManifestFilename,
            `because its file '${filename}' conflicts with itself`
          );
        }

        throw createManifestCannotBeLoadedError(
          absoluteManifestFilename,
          `because its file '${filename}' conflicts with its other file '${otherFilename}'`
        );
      }
    }
  }

  return {...manifest, absoluteManifestFilename};
}
